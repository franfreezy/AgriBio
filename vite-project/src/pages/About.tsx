import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="about-content">
        <p>
          At AB DATA, we believe that data is the cornerstone of modern agriculture. Harnessing accurate, timely, and actionable data empowers farmers, researchers, and agribusinesses to make informed decisions, optimize resources, and drive innovation. Our mission is to bridge the gap between agriculture and biotechnology by providing data-driven solutions that foster sustainable farming and address the challenges of a rapidly changing world.
        </p>
        
        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            We envision a future where data visualization and reporting revolutionize agricultural practices, enabling stakeholders to make informed decisions, ensure food security, and promote sustainable resource management. By leveraging cutting-edge technology, we aim to transform raw data into actionable insights that drive innovation and growth in the agricultural sector.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <p>
            We specialize in providing advanced data visualization and reporting tools tailored for the agricultural sector. Our solutions empower stakeholders to:
          </p>
          <ul>
            <li>Analyze complex agricultural data with intuitive dashboards</li>
            <li>Generate actionable insights to optimize farming practices</li>
            <li>Monitor environmental impact through real-time reporting</li>
            <li>Enhance decision-making with predictive analytics</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
