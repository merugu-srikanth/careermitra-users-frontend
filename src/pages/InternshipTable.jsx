import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  GraduationCap, 
  Clock, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

const InternshipTable = () => {
  // Job data from the provided Excel content
  const jobs = [
    {
      title: "Junior Engineer (Electrical)",
      organization: "Reserve Bank of India",
      websiteUrl: "https://opportunities.rbi.org.in",
      category: "Banks / Finance",
      postDate: "2026-04-16",
      deadline: "2026-05-06",
      noOfPosts: 4,
      qualifications: "Diploma in Electrical or Electrical & Electronics Engineering",
      age: "20-30",
      jobType: "Full Time"
    },
    {
      title: "Junior Engineer (Civil)",
      organization: "Reserve Bank of India",
      websiteUrl: "https://opportunities.rbi.org.in",
      category: "Banks / Finance",
      postDate: "2026-04-16",
      deadline: "2026-05-06",
      noOfPosts: 7,
      qualifications: "Diploma in Civil Engineering with minimum 65% marks",
      age: "20-30",
      jobType: "Full Time"
    },
    {
      title: "Medical Lab Technician (MLT)",
      organization: "Broadcast Engineering Consultants India Limited (BECIL)",
      websiteUrl: "https://www.becil.com",
      category: "Central Government",
      postDate: "2026-04-16",
      deadline: "2026-04-27",
      noOfPosts: 26,
      qualifications: "B.Sc in Medical Lab Technology from recognized institute",
      age: "21-35",
      jobType: "Skillup"
    },
    {
      title: "Perfusionist",
      organization: "Broadcast Engineering Consultants India Limited (BECIL)",
      websiteUrl: "https://www.becil.com",
      category: "Central Government",
      postDate: "2026-04-16",
      deadline: "2026-04-27",
      noOfPosts: 2,
      qualifications: "B.Sc Degree in relevant field from recognized university",
      age: "18-40",
      jobType: "Skillup"
    },
    {
      title: "Research Intern",
      organization: "National Institute of Rural Development and Panchayati Raj (NIRDPR)",
      websiteUrl: "https://career.nirdpr.in",
      category: "Central Government",
      postDate: "2026-04-15",
      deadline: "2026-04-17",
      noOfPosts: 2,
      qualifications: "Final year UG students or graduates in Social Sciences",
      age: "18-25",
      jobType: "Internship"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter jobs based on search term and job type filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || job.jobType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(deadline);
    if (Number.isNaN(endDate.getTime())) return 0;
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };



  return (
    <div id='internship' className="h-scree bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Section */}
     

      {/* Filters Section */}
      <div className="px-6 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, organization or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
                <div className="bg-orange-50 rounded-lg px-4 py-2">
              <span className="text-orange-600 font-semibold">{filteredJobs.length} Active Positions</span>
            </div>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Opportunities 
              </button>
             
              <button
                onClick={() => setFilterType('Skillup')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'Skillup' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Skill Up opportunities
              </button>
              <button
                onClick={() => setFilterType('internship')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'internship' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Internship
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title & Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posts
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualifications
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y  divide-gray-200">
                  {currentJobs.map((job, index) => {
                    const daysRemaining = getDaysRemaining(job.deadline);
                    const isUrgent = daysRemaining <= 10 && daysRemaining > 0;
                    const isExpired = daysRemaining < 0;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{job.title}</span>
                            <span className="text-xs text-gray-500">{job.organization}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{job.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{formatDate(job.postDate)}</span>
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex flex-col">
                            <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-700'}`}>
                              {formatDate(job.deadline)}
                            </span>
                            {!isExpired && (
                              <span className={`text-xs ${isUrgent ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
                                {daysRemaining} days left
                              </span>
                            )}
                            {isExpired && (
                              <span className="text-xs text-red-500">Expired</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-700">{job.noOfPosts}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                            {job.qualifications}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{job.age}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.jobType === 'Internship' 
                              ? 'bg-purple-100 text-purple-800'
                              : job.jobType === 'Skillup'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={job.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                          >
                            Apply <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {currentJobs.map((job, index) => {
                const daysRemaining = getDaysRemaining(job.deadline);
                const isUrgent = daysRemaining <= 10 && daysRemaining > 0;
                
                return (
                  <div key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.organization}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.jobType === 'Internship' 
                          ? 'bg-purple-100 text-purple-800'
                          : job.jobType === 'Skillup'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {job.jobType}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">{job.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">{job.noOfPosts} Posts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">Posted: {formatDate(job.postDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`${isUrgent ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                          Deadline: {formatDate(job.deadline)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Qualification:</span>
                      <p className="text-gray-700 mt-1">{job.qualifications}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">Age: {job.age}</span>
                      <a
                        href={job.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
                      >
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipTable;