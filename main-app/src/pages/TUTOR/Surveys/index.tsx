import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Input, Button, Space, Tag, Statistic, Row, Col, message } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import instructorRequests from '../../../requests/instructor.request.tsx';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Survey {
  id: number;
  course_id: number;
  course_title: string;
  user_id: number;
  user_name: string;
  user_email: string;
  satisfaction_rating: number;
  additional_comments: string;
  submission_date: string;
}

interface SurveyStats {
  total_surveys: number;
  average_rating: number;
  rating_distribution: {
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
  };
  recent_surveys_30_days: number;
  course_id?: number;
}

const InstructorSurveyManagement: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    courseId: undefined as number | undefined,
    rating: undefined as number | undefined,
    searchText: '',
  });

  // Fetch surveys with filters
  const fetchSurveys = async (page: number = 1, pageSize: number = 20) => {
    try {
      setLoading(true);
      const response = await instructorRequests.getAllSurveys(
        page,
        pageSize,
        filters.courseId,
        filters.rating
      );
      
      console.log('Survey API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle different possible response structures
      const surveyData = response.data?.surveys || response.data || (response as any).surveys || [];
      const paginationData = response.data?.pagination || (response as any).pagination || {};
      
      setSurveys(Array.isArray(surveyData) ? surveyData : []);
      setPagination({
        current: page,
        pageSize,
        total: paginationData.total || 0,
      });
    } catch (error: any) {
      console.error('Survey fetch error:', error);
      message.error('Failed to fetch surveys: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch survey statistics
  const fetchStats = async () => {
    try {
      const response = await instructorRequests.getSurveyStats(filters.courseId);
      console.log('Stats API Response:', response);
      setStats(response.data || response);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
      message.error('Failed to fetch survey statistics: ' + error.message);
    }
  };

  // Fetch instructor courses for dropdown
  const fetchCourses = async () => {
    try {
      const response = await instructorRequests.getInstructorCourses();
      console.log('Courses API Response:', response);
      console.log('Courses data:', response.data);
      
      // Handle different possible response structures
      const coursesData = response.data?.courses || response.data?.items || response.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error: any) {
      console.error('Courses fetch error:', error);
      message.error('Failed to fetch courses: ' + error.message);
    }
  };

  useEffect(() => {
    fetchSurveys();
    fetchStats();
  }, [filters.courseId, filters.rating]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle table pagination
  const handleTableChange = (paginationInfo: any) => {
    fetchSurveys(paginationInfo.current, paginationInfo.pageSize);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Get rating color
  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'orange';
    return 'red';
  };

  // Get rating text
  const getRatingText = (rating: number): string => {
    const ratingMap: { [key: number]: string } = {
      5: 'Very Satisfied',
      4: 'Satisfied',
      3: 'Neutral',
      2: 'Dissatisfied',
      1: 'Very Dissatisfied'
    };
    return ratingMap[rating] || 'Unknown';
  };

  // Table columns
  const columns: ColumnsType<Survey> = [
    {
      title: 'Course',
      dataIndex: 'course_title',
      key: 'course_title',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Student',
      key: 'student',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.user_name}</div>
          <div className="text-xs text-gray-500">{record.user_email}</div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'satisfaction_rating',
      key: 'satisfaction_rating',
      width: 120,
      render: (rating: number) => (
        <Tag color={getRatingColor(rating)}>
          {rating}/5 - {getRatingText(rating)}
        </Tag>
      ),
      sorter: (a, b) => a.satisfaction_rating - b.satisfaction_rating,
    },
    {
      title: 'Comments',
      dataIndex: 'additional_comments',
      key: 'additional_comments',
      ellipsis: true,
      render: (comments: string) => (
        <div className="max-w-xs">
          {comments || <span className="text-gray-400 italic">No comments</span>}
        </div>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submission_date',
      key: 'submission_date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.submission_date).getTime() - new Date(b.submission_date).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              // TODO: Implement view survey details modal
              message.info('Survey details view coming soon');
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Management</h1>
        <p className="text-gray-600">Monitor and analyze feedback from your course students</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Surveys"
                value={stats.total_surveys}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Rating"
                value={stats.average_rating}
                precision={2}
                suffix="/ 5"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Recent (30 days)"
                value={stats.recent_surveys_30_days}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="mb-2">
                <span className="text-sm text-gray-500">Rating Distribution</span>
              </div>
              <div className="space-y-1">
                {Object.entries(stats.rating_distribution).map(([key, value]) => {
                  const rating = parseInt(key.replace('rating_', ''));
                  return (
                    <div key={key} className="flex justify-between text-xs">
                      <span>{rating}★</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Filter
            </label>
            <Select
              placeholder="All My Courses"
              style={{ width: 200 }}
              allowClear
              value={filters.courseId}
              onChange={(value) => handleFilterChange('courseId', value)}
            >
              {courses.map((course: any) => (
                <Option key={course.id} value={course.id}>
                  {course.course_name || course.title || course.name}
                </Option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating Filter
            </label>
            <Select
              placeholder="All Ratings"
              style={{ width: 150 }}
              allowClear
              value={filters.rating}
              onChange={(value) => handleFilterChange('rating', value)}
            >
              <Option value={5}>5 - Very Satisfied</Option>
              <Option value={4}>4 - Satisfied</Option>
              <Option value={3}>3 - Neutral</Option>
              <Option value={2}>2 - Dissatisfied</Option>
              <Option value={1}>1 - Very Dissatisfied</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              placeholder="Search by student name or course"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
            />
          </div>

          <div className="flex-1"></div>
          
          <div className="self-end">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                // TODO: Implement export functionality
                message.info('Export functionality coming soon');
              }}
            >
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Surveys Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={surveys}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} surveys`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default InstructorSurveyManagement;
