-- Create default categories for the ebook platform
-- This script should be run after setting up the Appwrite database

-- Computer Science Fundamentals
INSERT INTO categories (name, slug, description, color, ebookCount) VALUES 
('Algorithms & Data Structures', 'algorithms-data-structures', 'Books covering fundamental algorithms, data structures, and computational complexity', '#6366f1', 0),
('Programming Languages', 'programming-languages', 'Language-specific guides, references, and best practices', '#10b981', 0),
('Software Engineering', 'software-engineering', 'Software design patterns, architecture, and development methodologies', '#f59e0b', 0),
('Web Development', 'web-development', 'Frontend, backend, and full-stack web development resources', '#ef4444', 0),
('Database Systems', 'database-systems', 'Database design, SQL, NoSQL, and data management', '#8b5cf6', 0),
('Machine Learning & AI', 'machine-learning-ai', 'Artificial intelligence, machine learning, and data science', '#06b6d4', 0),
('System Design', 'system-design', 'Distributed systems, scalability, and system architecture', '#84cc16', 0),
('DevOps & Infrastructure', 'devops-infrastructure', 'Deployment, monitoring, containerization, and cloud computing', '#f97316', 0),
('Mobile Development', 'mobile-development', 'iOS, Android, and cross-platform mobile app development', '#ec4899', 0),
('Cybersecurity', 'cybersecurity', 'Information security, cryptography, and ethical hacking', '#64748b', 0);
