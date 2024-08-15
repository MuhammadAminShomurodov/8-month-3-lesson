import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Space, Modal, Form, Input, message, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./StudentList.css";

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents(searchQuery);
  }, [students, searchQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Student[]>(
        "http://localhost:3000/students"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error(
        "Failed to fetch students. Please check your server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercasedQuery) ||
        student.email.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredStudents(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentStudent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (student: Student) => {
    setIsEditMode(true);
    setCurrentStudent(student);
    form.setFieldsValue(student);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (isEditMode && currentStudent) {
        await axios.put(
          `http://localhost:3000/students/${currentStudent.id}`,
          values
        );
        setStudents(
          students.map((student) =>
            student.id === currentStudent.id
              ? { ...student, ...values }
              : student
          )
        );
        message.success("Student updated successfully");
      } else {
        const response = await axios.post(
          "http://localhost:3000/students",
          values
        );
        setStudents([...students, response.data]);
        message.success("Student added successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving student:", error);
      message.error("Failed to save student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingId(id);
        try {
          await axios.delete(`http://localhost:3000/students/${id}`);
          setStudents(students.filter((student) => student.id !== id));
          message.success("Student deleted successfully");
        } catch (error) {
          console.error("Error deleting student:", error);
          message.error("Failed to delete student. Please try again.");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="column-text">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="column-text">{text}</span>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (text: number) => <span className="column-text">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Student) => (
        <Space size="middle">
          <Button
            onClick={() => showEditModal(record)}
            type="link"
            className="action-button"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            type="link"
            danger
            className="action-button"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="header">
        <Input.Search
          placeholder="Search by name or email"
          onChange={handleSearchChange}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <div className="btns">
          <Button type="primary" onClick={showAddModal} className="add-button">
            Add Student
          </Button>
          <Button
            type="default"
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table<Student>
            dataSource={filteredStudents}
            columns={columns}
            rowKey="id"
            className="student-table"
            rowClassName={(record) =>
              deletingId === record.id ? "student-row fade-out" : "student-row"
            }
          />
        )}
      </div>
      <Modal
        title={isEditMode ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="student-modal"
      >
        <Form form={form} layout="vertical" name="studentForm">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the student name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the student email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[
              { required: true, message: "Please input the student age!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentList;
