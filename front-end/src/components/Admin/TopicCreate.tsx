/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, message, Space, Tag } from 'antd';
import { Topic } from '@models/Domain';

/**
 * Component for viewing and adding new topics.
 */
function TopicCreate() {
  const [inputValue, setInputValue] = useState<string>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  /**
   * Load all existing topics
   */
  function loadTopics() {
    const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL}/topic/`;
    fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      // Add topics to the state
      .then((data) => setTopics(data));
  }

  /**
   * Upload a new topic to the back-end
   */
  function uploadTopic() {
    // Get the input value
    const name: string = inputValue;

    // Upload the topic
    const endpoint: string = `${process.env.NEXT_PUBLIC_FE_URL}/api/admin/topic/upload`;
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        // Show an error message if upload was not successful
        if (res.status !== 201) {
          message.error('Failed to add new topic!');
          return;
        }
        // Empty the input field
        setInputValue(null);
        // Load the updated list op topics
        loadTopics();
      });
  }

  // Initial loading of all topics
  useEffect(() => loadTopics(), []);

  return (
    <Card>
      <Space direction="vertical">
        <div>
          {topics.map((topic) => <Tag key={topic.id}>{topic.name}</Tag>)}
        </div>
        <Divider />
        <Space>
          <Input
            style={{ width: 300 }}
            placeholder="Enter new topic..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={uploadTopic}
          />
          <Button
            type="primary"
            onClick={uploadTopic}
          >
            Add
          </Button>
        </Space>
      </Space>
    </Card>
  );
}

export default TopicCreate;
