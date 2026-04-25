-- Seed data for local development

-- Institution
INSERT INTO institutions (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Arizona State University');

-- Crisis resources
INSERT INTO crisis_resources (institution_id, name, phone, description, available_24h) VALUES
  ('00000000-0000-0000-0000-000000000001', '988 Suicide & Crisis Lifeline', '988', 'Free, confidential support 24/7. Call or text 988.', true),
  ('00000000-0000-0000-0000-000000000001', 'ASU Counseling Services', '480-965-6146', 'Free counseling for enrolled students. Walk-ins welcome.', false),
  ('00000000-0000-0000-0000-000000000001', 'Crisis Text Line', '741741', 'Text HOME to 741741 for free crisis support.', true);

-- Channels
INSERT INTO channels (id, name, category, description) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'First-Gen CS', 'major', 'Computer science students supporting each other'),
  ('c0000000-0000-0000-0000-000000000002', 'First-Gen Pre-Med', 'major', 'Pre-med students sharing tips and resources'),
  ('c0000000-0000-0000-0000-000000000003', 'First-Gen Business', 'major', 'Business majors navigating internships and networking'),
  ('c0000000-0000-0000-0000-000000000004', 'First-Gen Immigrant', 'identity', 'Navigating college as an immigrant student'),
  ('c0000000-0000-0000-0000-000000000005', 'First-Gen Rural', 'identity', 'Students from rural communities'),
  ('c0000000-0000-0000-0000-000000000006', 'First-Gen Parent', 'identity', 'Balancing parenting and academics'),
  ('c0000000-0000-0000-0000-000000000007', 'First-Gen Veteran', 'identity', 'Veterans transitioning to college life'),
  ('c0000000-0000-0000-0000-000000000008', 'Financial Stress', 'challenge', 'Managing money and finding aid'),
  ('c0000000-0000-0000-0000-000000000009', 'Imposter Syndrome', 'challenge', 'You belong here — let us talk about it'),
  ('c0000000-0000-0000-0000-000000000010', 'Family Pressure', 'challenge', 'Navigating family expectations'),
  ('c0000000-0000-0000-0000-000000000011', 'Work-Life Balance', 'challenge', 'Juggling work, school, and life'),
  ('c0000000-0000-0000-0000-000000000012', 'Win Board', 'win_board', 'Celebrate your wins — big and small!');

-- Sample resources
INSERT INTO resources (institution_id, title, plain_language_description, intended_audience, access_steps, what_to_expect, available_languages, tags) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Emergency Financial Aid Fund',
   'If you have an unexpected expense like a car repair, medical bill, or textbook cost, this fund can help. You can get up to $500 within 3 business days. You do not need to pay it back.',
   'Any enrolled student facing an unexpected financial emergency. No minimum GPA required.',
   ARRAY['Go to the Financial Aid Office in Room 201 of the Student Services Building', 'Ask for the Emergency Aid Application — it is one page', 'Describe your situation in 2-3 sentences', 'Submit the form at the front desk', 'You will hear back within 3 business days by email'],
   'A staff member will review your application. Most students are approved. The money goes directly to your student account.',
   ARRAY['English', 'Spanish'], ARRAY['flexible_scheduling']),
  ('00000000-0000-0000-0000-000000000001', 'Free Tutoring Center',
   'Get free one-on-one or small group help with any class. Tutors are students who did well in the same courses.',
   'All enrolled students. Tutoring is available for most 100- and 200-level courses.',
   ARRAY['Visit the Tutoring Center on the 2nd floor of the Library', 'Sign in at the front desk with your student ID', 'Tell them which class you need help with', 'A tutor will work with you for up to 1 hour'],
   'Tutors will ask what you are working on and help you understand the material.',
   ARRAY['English', 'Spanish', 'Mandarin'], ARRAY['evening_accessible', 'asynchronous']),
  ('00000000-0000-0000-0000-000000000001', 'Disability Resource Center',
   'If you have a disability or health condition that affects your learning, this office helps you get accommodations.',
   'Students with documented disabilities or health conditions.',
   ARRAY['Call or visit the Disability Resource Center in the Student Union, Room 105', 'Schedule an intake meeting', 'Bring any documentation you have', 'Your coordinator will create an accommodation plan with you'],
   'The intake meeting is about 30 minutes. Staff are trained to be supportive and confidential.',
   ARRAY['English'], ARRAY['accommodation_pathway', 'disability_specific']),
  ('00000000-0000-0000-0000-000000000001', 'Campus Childcare Assistance',
   'If you are a parent, this program helps pay for childcare while you are in class or studying.',
   'Student parents enrolled in at least 6 credit hours.',
   ARRAY['Contact the Family Resource Center', 'Fill out the Childcare Assistance Application', 'Provide proof of enrollment and your class schedule'],
   'Processing takes about 1-2 weeks. Payments go directly to the childcare provider.',
   ARRAY['English', 'Spanish'], ARRAY['childcare', 'flexible_scheduling']);
