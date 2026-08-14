
UPDATE public.site_settings SET avatar_url = '/__l5e/assets-v1/9c3fea03-6344-4598-8b58-df10d805a79f/mihir-avatar-cutout.png';

UPDATE public.projects SET
research = 'I studied five widely used budgeting apps and mapped where people drop off. Two patterns repeated: onboarding asks for too much before showing any value, and spending insight is buried inside charts that need interpretation. I also collected informal feedback from eight students and early-career professionals who track money manually in notes apps. Their shared need was not analytics — it was a fast answer to "can I spend this right now?".',
design_system = 'A compact mobile system built in Figma with auto-layout components: an 8pt spacing scale, a two-weight type ramp for balances versus labels, a single saturated accent reserved for money-in and money-out states, and neutral surfaces everywhere else. Components include the balance card, category chip, transaction row, progress ring and bottom sheet, each with default, pressed and empty states so screens could be assembled quickly and stay consistent.',
outcome = 'A complete, clickable prototype covering onboarding, dashboard, add-transaction, category budgets and monthly review. The dashboard answers the core question in one glance — remaining safe-to-spend on top, category pressure below — and adding a transaction takes three taps from any screen. In walkthroughs with the same testers, everyone completed the add-and-categorise task without guidance.',
learnings = 'Reducing decisions mattered more than adding features: cutting the add-transaction form from seven fields to three removed most hesitation. I also learned to design the empty and first-run states first — they set the tone of a finance product far more than the fully populated dashboard.'
WHERE slug = 'finance-tracker';

UPDATE public.projects SET
research = 'I audited popular food-delivery flows and timed how long it takes to go from opening the app to a confirmed pizza order. The friction was rarely the menu — it was customisation: toppings, size and crust are usually spread across separate steps with unclear price impact. I sketched the ordering journey of a hungry, distracted user and used that as the constraint for every screen.',
design_system = 'A warm, appetite-led system: photography-first cards, a dark neutral base so food imagery carries the colour, one accent for calls to action, and generous corner radii. Typography pairs a tight display face for dish names with a highly legible body face for ingredients and prices. Reusable components cover the dish card, topping selector, quantity stepper, cart row and sticky order bar.',
outcome = 'A full ordering prototype: browse, dish detail with live-updating price, customisation sheet, cart, checkout and order tracking. The live price on the customisation sheet removed the most common complaint from my reference audit — not knowing the cost until checkout.',
learnings = 'Food products sell on imagery, so the UI has to step back. I also learned how much a persistent sticky order bar reduces navigation anxiety: users stopped going back to the cart to check state because the state was always visible.'
WHERE slug = 'forno';

UPDATE public.projects SET
research = 'I looked at how heritage motorcycle brands present themselves online and found a split: either heavy marketing pages with little product clarity, or catalogue pages with no emotion. I collected reference material from the brand''s own campaigns to understand its visual language — grain, chrome, open road, muted earth tones — and used it as a boundary rather than inventing a new identity.',
design_system = 'An editorial system for a heritage brand: full-bleed imagery, a restrained monochrome base with a single warm metallic accent, wide letter-spaced eyebrows for section labels, and a strict 12-column grid that lets hero moments break out. Components include the model card, spec strip, story block, gallery scroller and configurator preview.',
outcome = 'A responsive marketing and product site concept with a cinematic landing sequence, model line-up, individual model pages with specifications, a colour configurator view and a dealer/enquiry flow. The prototype demonstrates scroll-driven storytelling without losing the practical path to a specific model.',
learnings = 'Designing inside an established brand taught me restraint — the strongest decision was removing colour, not adding it. I also learned to plan scroll pacing on paper first, so each section had one job instead of competing for attention.'
WHERE slug = 'royal-enfield';

UPDATE public.projects SET
research = 'Desktop food ordering behaves differently from mobile: people browse more, compare more, and often order for a group. I reviewed how existing sites handle group ordering and found carts that hide who ordered what. That gap shaped the layout — a persistent side cart that stays readable while browsing.',
design_system = 'A wide-canvas system with a two-column shell: filterable menu grid on the left, persistent cart on the right. Warm neutrals, one accent for pricing and actions, consistent card ratios so imagery aligns across rows, and a clear hierarchy between dish name, description and price. Components cover filters, dish card, quantity control, cart line item and checkout summary.',
outcome = 'A complete desktop web ordering concept: hero and offers, filterable menu, dish detail overlay, persistent cart, checkout and confirmation. Browsing never interrupts the cart, so building a multi-item order takes no page changes.',
learnings = 'Translating a mobile pattern to desktop directly is the wrong instinct — the extra width is only useful if it removes a step. Keeping the cart visible was the single change that made the whole flow feel faster.'
WHERE slug = 'pizza-web-design';

UPDATE public.projects SET
research = 'I broke down the existing shopping journey for sneakers and listed every point where a buyer hesitates: size confidence, colourway comparison, and whether the product photos match reality. Those three doubts became the design brief. I also reviewed how strong sportswear sites use motion and negative space to make a product feel premium.',
design_system = 'A design-system-led project: tokens for colour, type scale, spacing, radii and elevation, then components built on top — product card, size selector, colour swatch, review summary, sticky add-to-bag and filter panel — each with hover, selected, disabled and out-of-stock states. High-contrast monochrome base with product colour as the only accent so any colourway looks intentional.',
outcome = 'A full e-commerce redesign concept: landing, category with filters, product detail with colourway and size selection, bag, and checkout. Documented components mean any new category page can be assembled from existing pieces without redrawing screens.',
learnings = 'Building the system before the pages was slower for two days and faster for the rest of the project. Explicit state coverage — especially out-of-stock and error — is what separates a component library from a set of pretty frames.'
WHERE slug = 'nike-shoes-website';

UPDATE public.projects SET
research = 'Gaming interfaces are read at a glance, often while playing. I studied console and PC dashboards to see what information survives that glance: current session, friends online, and one-tap resume. Everything else is secondary. I also noted how heavily these interfaces rely on motion and focus states because they are frequently navigated with a controller, not a mouse.',
design_system = 'A dark, high-contrast interaction system: deep neutral surfaces, luminous accents used only for focus and active states, tight geometric type, and clear focus rings sized for controller navigation. Components include the game tile, session card, friend row, quick-action rail and a directional focus treatment that carries between them.',
outcome = 'An interactive gaming dashboard concept with library browsing, game detail, session stats, friends presence and settings — designed and prototyped for directional navigation, where every focusable element has a visible, animated focus state.',
learnings = 'Designing for a controller forced a real navigation model instead of free-form clicking. Motion here is functional: it shows where focus travelled, and removing it made the same layout feel broken.'
WHERE slug = 'controller';
