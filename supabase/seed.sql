-- Insert customization presets for shapes
INSERT INTO customization_presets (shape, min_width, max_width, min_height, max_height, min_thickness, max_thickness, max_text_length, available_fonts, price_multiplier) VALUES
('cuore', 5.0, 15.0, 5.0, 15.0, 0.5, 2.0, 50, '{"Lora", "Inter", "Dancing Script"}', 1.0),
('stella', 5.0, 15.0, 5.0, 15.0, 0.5, 2.0, 50, '{"Lora", "Inter", "Dancing Script"}', 1.1),
('rettangolo', 5.0, 20.0, 3.0, 10.0, 0.5, 2.0, 80, '{"Lora", "Inter", "Dancing Script"}', 0.9),
('cerchio', 5.0, 15.0, 5.0, 15.0, 0.5, 2.0, 40, '{"Lora", "Inter", "Dancing Script"}', 1.0),
('albero', 6.0, 12.0, 8.0, 18.0, 0.5, 2.0, 30, '{"Lora", "Inter", "Dancing Script"}', 1.2),
('casetta', 6.0, 12.0, 7.0, 15.0, 0.5, 2.0, 40, '{"Lora", "Inter", "Dancing Script"}', 1.15);

-- Insert addon groups
INSERT INTO addon_groups (id, name, description, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Confetti', 'Confetti di vari gusti e colori', true),
('22222222-2222-2222-2222-222222222222', 'Veli', 'Veli eleganti in organza', true),
('33333333-3333-3333-3333-333333333333', 'Ceste', 'Ceste decorative in vimini', true);

-- Insert addon options - Confetti
INSERT INTO addon_options (group_id, name, description, price, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Confetti Mandorla Bianco', 'Confetti classici alle mandorle, colore bianco', 8.50, true),
('11111111-1111-1111-1111-111111111111', 'Confetti Mandorla Rosa', 'Confetti alle mandorle, colore rosa', 8.50, true),
('11111111-1111-1111-1111-111111111111', 'Confetti Mandorla Azzurro', 'Confetti alle mandorle, colore azzurro', 8.50, true),
('11111111-1111-1111-1111-111111111111', 'Confetti Cioccolato Mix', 'Mix di confetti al cioccolato fondente e al latte', 9.50, true);

-- Insert addon options - Veli
INSERT INTO addon_options (group_id, name, description, price, is_active) VALUES
('22222222-2222-2222-2222-222222222222', 'Velo Organza Bianco', 'Velo in organza bianca con nastro', 2.50, true),
('22222222-2222-2222-2222-222222222222', 'Velo Organza Rosa', 'Velo in organza rosa con nastro', 2.50, true),
('22222222-2222-2222-2222-222222222222', 'Velo Organza Azzurro', 'Velo in organza azzurra con nastro', 2.50, true),
('22222222-2222-2222-2222-222222222222', 'Velo Organza Avorio', 'Velo in organza avorio con nastro', 2.50, true);

-- Insert addon options - Ceste
INSERT INTO addon_options (group_id, name, description, price, is_active) VALUES
('33333333-3333-3333-3333-333333333333', 'Cestino Piccolo', 'Cestino in vimini naturale 15x10 cm', 5.00, true),
('33333333-3333-3333-3333-333333333333', 'Cestino Grande', 'Cestino in vimini naturale 20x15 cm', 7.50, true);

-- Insert demo products
INSERT INTO products (id, slug, name, short_description, description, category, event_type, base_price, is_featured, is_customizable, inspiration_type, default_shape, materials) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cuore-inciso-matrimonio', 'Cuore Inciso Matrimonio', 'Bomboniera a forma di cuore con nomi e data personalizzabili', 'Elegante bomboniera in legno naturale a forma di cuore, perfetta per il tuo matrimonio. Realizzata artigianalmente con legno di alta qualità, può essere personalizzata con i nomi degli sposi e la data del matrimonio. Finitura levigata e incisione laser di precisione.', 'Bomboniere', ARRAY['matrimonio'], 12.50, true, true, 'entrambi', 'cuore', ARRAY['Legno di faggio', 'Finitura naturale']),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'stella-battesimo', 'Stella Battesimo', 'Stellina decorativa per battesimo con nome del bambino', 'Dolce stellina in legno chiaro ideale per il battesimo. Personalizzabile con il nome del neonato e la data del sacramento. Dimensioni perfette per essere appese o appoggiate, un ricordo che durerà nel tempo.', 'Bomboniere', ARRAY['battesimo', 'nascita'], 10.00, true, true, 'entrambi', 'stella', ARRAY['Legno di pioppo', 'Finitura satinata']),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'segnaposto-albero-comunione', 'Segnaposto Albero della Vita', 'Segnaposto a forma di albero per comunione e cresima', 'Simbolico albero della vita in legno, ideale come segnaposto o bomboniera per comunione e cresima. Può includere il nome del festeggiato e la data. Design elegante che rappresenta crescita e spiritualità.', 'Segnaposto', ARRAY['comunione'], 15.00, true, true, 'configurabile', 'albero', ARRAY['Legno di betulla', 'Finitura naturale']),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'casetta-nascita', 'Casetta Dolce Arrivo', 'Casetta decorativa per celebrare la nascita', 'Adorabile casetta in legno per celebrare l''arrivo di un bebè. Personalizzabile con nome, data e peso del neonato. Colori pastello disponibili su richiesta. Perfetta come bomboniera o decorazione per la cameretta.', 'Bomboniere', ARRAY['nascita', 'battesimo'], 13.50, false, true, 'configurabile', 'casetta', ARRAY['Legno di pino', 'Finitura atossica']),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'portafoto-rettangolare', 'Portafoto Ricordo Speciale', 'Cornice portafoto rettangolare personalizzabile', 'Cornice portafoto in legno massello con incisione personalizzata. Perfetta per ogni evento: matrimonio, battesimo, anniversario. Può contenere una foto 10x15 cm. Lavorazione artigianale italiana con attenzione ai dettagli.', 'Bomboniere', ARRAY['matrimonio', 'battesimo', 'comunione', 'altro'], 18.00, false, true, 'entrambi', 'rettangolo', ARRAY['Legno massello di noce', 'Vetro temperato']);

-- Insert product images (placeholder paths - in production these would be actual Supabase storage URLs)
INSERT INTO product_images (product_id, url, alt, sort_order, is_cover) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/images/products/cuore-matrimonio-1.jpg', 'Cuore inciso matrimonio vista frontale', 0, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/images/products/cuore-matrimonio-2.jpg', 'Cuore inciso matrimonio dettaglio incisione', 1, false),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/images/products/stella-battesimo-1.jpg', 'Stella battesimo vista frontale', 0, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/images/products/stella-battesimo-2.jpg', 'Stella battesimo con personalizzazione', 1, false),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '/images/products/albero-comunione-1.jpg', 'Albero della vita comunione', 0, true),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '/images/products/casetta-nascita-1.jpg', 'Casetta nascita rosa', 0, true),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '/images/products/portafoto-1.jpg', 'Portafoto rettangolare legno', 0, true);
