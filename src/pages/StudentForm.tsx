import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

interface Student {
  id?: number;
  name: string;
  email: string;
  age: number;
}

const StudentForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/students/${id}`)
        .then((response) => {
          setStudent(response.data);
          form.setFieldsValue(response.data);
        })
        .catch((error) => {
          console.error("Error fetching student:", error);
          message.error("Failed to fetch student details.");
        });
    }
  }, [id, form]);

  const onFinish = async (values: Student) => {
    try {
      if (id) {
        // Update student
        await axios.put(`http://localhost:3000/students/${id}`, values);
        message.success("Student updated successfully!");
      } else {
        // Add new student
        await axios.post("http://localhost:3000/students", values);
        message.success("Student added successfully!");
      }
      navigate("/"); // Redirect after successful operation
    } catch (error) {
      console.error("Error saving student:", error);
      message.error("Failed to save student.");
    }
  };

  return (
    <Form
      form={form}
      initialValues={student || { name: "", email: "", age: undefined }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the student name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please input the student email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: "Please input the student age!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Update" : "Add"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
