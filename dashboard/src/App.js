import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import TimeSeriesChart from './components/time_series';
import EngagementChart from './components/EngagementCharts';
import SentimentChart from './components/SentinmentChart';
import SemanticSearch from './components/SemanticSearch';
import Chatbot from './components/chatbot';
import EventCorrelation from './components/EventCorrelation';

const App = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Social Media Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <TimeSeriesChart /> */}
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <EngagementChart /> */}
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <SentimentChart /> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <SemanticSearch />
        </Col>
      </Row>
      <Row>
        <Col>
          <Chatbot />
        </Col>
      </Row>
      <Row>
        <Col>
          <EventCorrelation />
        </Col>
      </Row>
    </Container>
  );
};

export default App;