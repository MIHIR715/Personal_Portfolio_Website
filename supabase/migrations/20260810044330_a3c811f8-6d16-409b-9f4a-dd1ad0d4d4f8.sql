CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- First signed-up user becomes admin (bootstrap)
CREATE OR REPLACE FUNCTION public.bootstrap_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_admin();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  description text,
  short_description text,
  year text,
  role text,
  tools text[] NOT NULL DEFAULT '{}',
  thumbnail_url text,
  hero_image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  problem text,
  goal text,
  research text,
  user_flow text[] NOT NULL DEFAULT '{}',
  wireframes text[] NOT NULL DEFAULT '{}',
  design_exploration text[] NOT NULL DEFAULT '{}',
  design_system text,
  final_ui text[] NOT NULL DEFAULT '{}',
  prototype_url text,
  outcome text,
  learnings text,
  seo_title text,
  seo_description text,
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published projects public" ON public.projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills public read" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage skills" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  start_date text,
  end_date text,
  grade text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
GRANT ALL ON public.education TO service_role;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "education public read" ON public.education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage education" ON public.education FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  start_date text,
  end_date text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experience TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experience public read" ON public.experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage experience" ON public.experience FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social public read" ON public.social_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage social" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read messages" ON public.messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update messages" ON public.messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete messages" ON public.messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  professional_title text,
  hero_headline text,
  hero_description text,
  about_text text,
  philosophy text,
  email text,
  phone text,
  location text,
  availability text,
  avatar_url text,
  resume_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (name, professional_title, hero_headline, hero_description, about_text, philosophy, email, phone, location, availability, avatar_url, resume_url) VALUES (
 'Mihirkumar Lad',
 'UI/UX Designer · Interaction Designer · Figma Specialist',
 'Designing digital experiences that feel simple, useful, and memorable.',
 'I am Mihir, a UI/UX and interaction designer who combines user-centered design, visual design, prototyping, and frontend awareness to create thoughtful digital experiences.',
 'I design high-fidelity interfaces and interactive prototypes in Figma, built through consistent, self-directed daily practice across independent projects. My work is grounded in user-centered design, wireframing, interaction design, and design systems. A frontend background in React.js and Tailwind CSS lets me make implementation-aware decisions and collaborate closely with developers.',
 'Good design balances user needs, business goals, visual clarity, interaction, accessibility, and technical feasibility. My Computer Engineering background gives me frontend awareness, so the interfaces I design are realistic to build and clear to hand off.',
 'Mihirlad615@gmail.com',
 '+91 7698514476',
 'Navsari, Gujarat, India',
 'Available for opportunities',
 '/__l5e/assets-v1/00a2ca5b-b346-4166-8a45-7efe477eaae2/mihir-avatar.jpg',
 '/__l5e/assets-v1/7c064a00-0ff1-4c05-9a6a-a3f8d3c9a433/Mihirkumar_Lad_Resume.pdf'
);

INSERT INTO public.education (institution, degree, start_date, end_date, grade, display_order) VALUES
 ('Vidyavardhini''s College of Engineering & Technology, Vasai','Bachelor of Engineering in Computer Engineering','Sep 2022','June 2026','CGPA: 7.59 / 10',1),
 ('Divine Public School, Navsari, Gujarat','HSC',NULL,'Jun 2022','74%',2),
 ('Divine Public School, Navsari, Gujarat','SSC',NULL,'Jun 2020','86%',3);

INSERT INTO public.skills (category, name, display_order) VALUES
 ('Design Tools','Figma',1),('Design Tools','Adobe XD',2),('Design Tools','Canva',3),
 ('UX Skills','Wireframing',1),('UX Skills','Prototyping',2),('UX Skills','User Flow Mapping',3),('UX Skills','Interaction Design',4),('UX Skills','Responsive Design',5),
 ('Design Principles','Design Systems',1),('Design Principles','Component Libraries',2),('Design Principles','Visual Hierarchy',3),('Design Principles','Typography',4),('Design Principles','Accessibility (WCAG)',5),
 ('Research Methods','User Research',1),('Research Methods','Competitive Analysis',2),('Research Methods','Heuristic Evaluation',3),('Research Methods','Usability Testing',4),
 ('Frontend','HTML5',1),('Frontend','CSS3',2),('Frontend','React.js',3),('Frontend','Tailwind CSS',4),('Frontend','JavaScript ES6+',5);

INSERT INTO public.projects (title, slug, subtitle, category, tags, short_description, description, year, role, tools, prototype_url, featured, display_order, problem, goal) VALUES
('Finance Tracker App','finance-tracker','Personal Budgeting Mobile App UI','UI/UX · Mobile Product Design',ARRAY['UI/UX','Mobile'],
 'A mobile finance-tracking app designed to make income, expenses, savings goals, and spending summaries easier to understand.',
 E'Designed a mobile finance-tracking app that turns income, expenses, and savings goals into clear visual summaries, making it faster for users to see where their money is going.\n\nSimplified the dashboard and transaction views to cut visual clutter, so users can scan spending by category and make budget decisions in seconds rather than digging through numbers.\n\nPrototyped the core flows — adding a transaction, checking spending summaries, setting a budget — end-to-end in Figma to validate the experience before any development work.',
 '2026','UI/UX Designer',ARRAY['Figma'],'https://www.figma.com/proto/KWXmyOraScyxIvfrMWdV4V?node-id=35-2&t=wYsAPDq9S7UcjRxi-6',true,1,
 'Personal finance apps often bury spending information in dense tables and numbers, making it hard for users to understand where their money actually goes.',
 'Turn income, expenses, and savings goals into clear visual summaries and simplify the dashboard and transaction views so budget decisions take seconds.'),
('FORNO','forno','Pizza Ordering App UI','UI/UX · Mobile App Design',ARRAY['UI/UX','Mobile'],
 'A pizza ordering app built around fast decision-making, clear pricing, and visible customization.',
 E'Designed FORNO, a pizza ordering app, with a menu-to-checkout flow built around fast decision-making — clear pricing, visible customization options, and a warm, appetite-driven visual style to keep users engaged.\n\nBuilt a reusable component library for product cards, toppings selector, and order-summary elements, reducing design inconsistency across screens and speeding up future iteration.\n\nPrototyped the full ordering journey in Figma, from browsing the menu to confirming an order, to test whether users could complete a purchase without friction or confusion.',
 '2026','UI/UX Designer',ARRAY['Figma'],'https://www.figma.com/proto/KWXmyOraScyxIvfrMWdV4V?node-id=170-2&t=4YrmiXYL9ogMiNVi-6',true,2,
 'Food ordering flows often hide pricing and customization behind extra steps, slowing down what should be a quick, appetite-driven decision.',
 'Design a menu-to-checkout flow with clear pricing and visible customization, supported by a reusable component library.'),
('Royal Enfield','royal-enfield','Motorcycle Brand Website UI','UI/UX · Web Design · Brand Experience',ARRAY['UI/UX','Web'],
 'A bold, brand-driven website concept helping buyers discover, compare, and decide on motorcycles.',
 E'Designed a bold, brand-driven website concept for Royal Enfield, using model showcases and clear spec breakdowns to help buyers compare bikes without leaving the page.\n\nStructured the information architecture across landing, comparison, and detail pages to match how buyers actually research motorcycles, from first impression to final decision.',
 '2026','UI/UX Designer',ARRAY['Figma'],'https://www.figma.com/proto/pAEbehE4YiapDU2loHS27W?node-id=88-2&t=wYsAPDq9S7UcjRxi-6',true,3,
 'Motorcycle buyers compare models across scattered pages, losing context between specs, imagery, and brand story.',
 'Structure the information architecture across landing, comparison, and detail pages to match how buyers actually research motorcycles.'),
('Pizza Web Design','pizza-web-design','Food Ordering Website UI','UI/UX · Web Design · E-commerce',ARRAY['UI/UX','Web','E-commerce'],
 'A food ordering website with clear menu categorization and a streamlined cart-to-checkout flow.',
 E'Designed a food ordering website with clear menu categorization and a streamlined cart-to-checkout flow, aimed at reducing the steps between browsing and placing an order.\n\nApplied conversion-focused UI patterns — visible CTAs, minimal form fields, prominent offers — to reduce drop-off points in the ordering process.',
 '2026','UI/UX Designer',ARRAY['Figma'],'https://www.figma.com/proto/pAEbehE4YiapDU2loHS27W?node-id=128-2&t=wYsAPDq9S7UcjRxi-6',false,4,
 'Long ordering flows with unclear menu structure and heavy forms create drop-off between browsing and checkout.',
 'Reduce the steps between browsing and placing an order using clear categorization and conversion-focused UI patterns.'),
('Nike Shoes Website','nike-shoes-website','Full E-Commerce Redesign','UI/UX · E-commerce · Design Systems',ARRAY['UI/UX','Web','E-commerce','Design Systems'],
 'A complete redesign of homepage, product listing, and product detail pages with a scalable component library.',
 E'Led a complete redesign of the homepage, product listing, and product detail pages, unifying the UI language so users experience a consistent brand feel while browsing.\n\nBuilt a reusable component library — buttons, cards, navigation, filters — so the design system could scale to new pages without rework.\n\nStreamlined the purchase flow and simplified the site''s information architecture to shorten the path from product discovery to checkout.',
 '2026','UI/UX Designer',ARRAY['Figma'],'https://www.figma.com/proto/pAEbehE4YiapDU2loHS27W?node-id=42-2&t=wYsAPDq9S7UcjRxi-6',true,5,
 'Inconsistent UI language across homepage, listing, and detail pages made the browsing experience feel fragmented.',
 'Unify the interface with a reusable component library and shorten the path from product discovery to checkout.'),
('Controller','controller','Gaming Dashboard Interface','UI/UX · Gaming · Interaction Design',ARRAY['UI/UX','Interaction Design'],
 'A gaming companion app with dark-mode aesthetics and tactile micro-interactions.',
 E'Designed a gaming companion app with dark-mode aesthetics and tactile micro-interactions, giving players quick visual feedback that fits a fast-paced gaming context.\n\nDesigned button-mapping, profile, and settings screens with consistent components, making custom configuration easy to find and adjust without digging through menus.',
 '2026','UI/UX Designer',ARRAY['UI/UX','Interaction Design'],'https://www.figma.com/proto/pAEbehE4YiapDU2loHS27W?node-id=7-6&t=wYsAPDq9S7UcjRxi-6',false,6,
 'Custom controller configuration is usually buried in nested menus with little visual feedback.',
 'Make button-mapping, profiles, and settings easy to find and adjust with consistent components and tactile micro-interactions.');