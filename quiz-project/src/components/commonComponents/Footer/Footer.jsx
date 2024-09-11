import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; 2024 QUIZ HUB. All rights reserved.</p>
        <ul style={styles.navList}>
          <li><a href="/about" style={styles.link}>About Us</a></li>
          <li><a href="/contact" style={styles.link}>Contact</a></li>
          <li><a href="/privacy" style={styles.link}>Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f1f1f1', 
    color: '#333',
    textAlign: 'center',
    padding: '20px 0',
    width: '100%',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', 
    position: 'relative', 
    bottom: '0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: '#007bff', 
    textDecoration: 'none',
  }
};

export default Footer;