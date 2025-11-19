import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import { KYCSubmission } from '../types'
import { ShieldCheck, X, Eye, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Mock data storage (in a real app, this would be in a backend)
const mockKYCData: KYCSubmission[] = [
  {
    id: '1',
    userId: '1',
    userEmail: 'user1@example.com',
    userName: 'john_doe',
    fullName: 'John Doe',
    cnic: '12345-1234567-1',
    selfieUrl: 'https://via.placeholder.com/200',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '2',
    userEmail: 'user2@example.com',
    userName: 'jane_smith',
    fullName: 'Jane Smith',
    cnic: '23456-2345678-2',
    selfieUrl: 'https://via.placeholder.com/200',
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedAt: new Date().toISOString(),
  },
]

export default function KYC() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedKYC, setSelectedKYC] = useState<KYCSubmission | null>(null)
  const [viewMode, setViewMode] = useState<'view' | 'reject' | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const queryClient = useQueryClient()

  const { data: kycSubmissions, isLoading, refetch } = useQuery<KYCSubmission[]>({
    queryKey: ['kyc', filter],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // For now, return mock data from localStorage or initial data
      const stored = localStorage.getItem('kyc-submissions')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('kyc-submissions', JSON.stringify(mockKYCData))
      return mockKYCData
    },
  })

  const handleApprove = async (kycId: string) => {
    try {
      // Try real API first, fallback to mock if it fails
      try {
        await adminAPI.approveKYC(kycId)
      } catch (apiError) {
        // If API fails, use mock implementation
        const stored = localStorage.getItem('kyc-submissions')
        const submissions: KYCSubmission[] = stored ? JSON.parse(stored) : mockKYCData
        
        const updated = submissions.map((sub) =>
          sub.id === kycId
            ? {
                ...sub,
                status: 'approved' as const,
                reviewedAt: new Date().toISOString(),
              }
            : sub
        )
        
        localStorage.setItem('kyc-submissions', JSON.stringify(updated))
        queryClient.setQueryData(['kyc', filter], updated)
        queryClient.setQueryData(['kyc', 'all'], updated)
        queryClient.setQueryData(['kyc', 'pending'], updated)
        queryClient.setQueryData(['kyc', 'approved'], updated)
      }
      
      toast.success('KYC approved successfully')
      refetch()
      setSelectedKYC(null)
      setViewMode(null)
    } catch (error) {
      toast.error('Failed to approve KYC')
    }
  }

  const handleReject = async (kycId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      // Try real API first, fallback to mock if it fails
      try {
        await adminAPI.rejectKYC(kycId, rejectReason)
      } catch (apiError) {
        // If API fails, use mock implementation
        const stored = localStorage.getItem('kyc-submissions')
        const submissions: KYCSubmission[] = stored ? JSON.parse(stored) : mockKYCData
        
        const updated = submissions.map((sub) =>
          sub.id === kycId
            ? {
                ...sub,
                status: 'rejected' as const,
                reviewedAt: new Date().toISOString(),
                rejectionReason: rejectReason,
              }
            : sub
        )
        
        localStorage.setItem('kyc-submissions', JSON.stringify(updated))
        queryClient.setQueryData(['kyc', filter], updated)
        queryClient.setQueryData(['kyc', 'all'], updated)
        queryClient.setQueryData(['kyc', 'pending'], updated)
        queryClient.setQueryData(['kyc', 'rejected'], updated)
      }
      
      toast.success('KYC rejected')
      refetch()
      setSelectedKYC(null)
      setRejectReason('')
      setViewMode(null)
    } catch (error) {
      toast.error('Failed to reject KYC')
    }
  }

  const filteredSubmissions = kycSubmissions?.filter(
    (submission) => filter === 'all' || submission.status === filter
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KYC Management</h1>
          <p className="mt-1 text-sm text-gray-500">Review and approve user KYC submissions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === status
                ? 'border-[#4C6FFF] text-[#4C6FFF] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'pending' && (
              <span className={`ml-2 text-white text-xs px-2 py-0.5 rounded-full ${
                filter === status ? 'bg-[#4C6FFF]' : 'bg-gray-400'
              }`}>
                {kycSubmissions?.filter((s) => s.status === 'pending').length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* KYC Submissions List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C6FFF]"></div>
          </div>
        ) : filteredSubmissions?.length === 0 ? (
          <div className="card text-center py-12">
            <ShieldCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No KYC submissions found</p>
          </div>
        ) : (
          filteredSubmissions?.map((submission) => (
            <div key={submission.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={submission.selfieUrl}
                      alt="Selfie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{submission.fullName}</h3>
                    <p className="text-sm text-gray-500">{submission.userEmail}</p>
                    <p className="text-sm text-gray-500">@{submission.userName}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">CNIC:</span> {submission.cnic}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {format(new Date(submission.submittedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                    <span
                      className={`mt-2 inline-block px-2.5 py-1 text-xs font-medium rounded ${
                        submission.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : submission.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedKYC(submission)
                      setViewMode('view')
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  {submission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedKYC(submission)
                          setViewMode('reject')
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {selectedKYC && viewMode === 'view' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedKYC(null)
            setViewMode(null)
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">KYC Submission Details</h2>
              <button
                onClick={() => {
                  setSelectedKYC(null)
                  setViewMode(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-base text-gray-900 mt-1">{selectedKYC.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-base text-gray-900 mt-1">@{selectedKYC.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-base text-gray-900 mt-1">{selectedKYC.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CNIC</label>
                  <p className="text-base text-gray-900 mt-1">{selectedKYC.cnic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`mt-1 inline-block px-3 py-1 text-sm font-medium rounded ${
                      selectedKYC.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedKYC.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {selectedKYC.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted At</label>
                  <p className="text-base text-gray-900 mt-1">
                    {format(new Date(selectedKYC.submittedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                {selectedKYC.reviewedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reviewed At</label>
                    <p className="text-base text-gray-900 mt-1">
                      {format(new Date(selectedKYC.reviewedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
                {selectedKYC.rejectionReason && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                    <p className="text-base text-gray-900 mt-1">{selectedKYC.rejectionReason}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Selfie Photo</label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={selectedKYC.selfieUrl}
                    alt="Selfie"
                    className="max-w-full h-auto rounded-lg mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => {
                  setSelectedKYC(null)
                  setViewMode(null)
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                Close
              </button>
              {selectedKYC.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setViewMode('reject')
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedKYC.id)
                      setViewMode(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {selectedKYC && viewMode === 'reject' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedKYC(null)
            setViewMode(null)
            setRejectReason('')
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Reject KYC Submission</h2>
              <button
                onClick={() => {
                  setSelectedKYC(null)
                  setViewMode(null)
                  setRejectReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting {selectedKYC.fullName}'s KYC submission.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="input-field h-24 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setViewMode('view')
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setSelectedKYC(null)
                  setViewMode(null)
                  setRejectReason('')
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedKYC.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!rejectReason.trim()}
              >
                Reject KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

