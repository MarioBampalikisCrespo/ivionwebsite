SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DROP SCHEMA IF EXISTS iviondb;

CREATE SCHEMA IF NOT EXISTS iviondb;
USE iviondb;

CREATE TABLE IF NOT EXISTS users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    usersurnames VARCHAR(255),
    userpassword VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    categoryname VARCHAR(255) NOT NULL,
    categorydescription VARCHAR(9999)
);

CREATE TABLE IF NOT EXISTS shipping_companies (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    shipping_company_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS colours (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    colourname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    productname VARCHAR(255) NOT NULL,
    productdescription VARCHAR(255) NOT NULL,
    productmemory VARCHAR(255) NOT NULL,
    productstorage VARCHAR(255) NOT NULL,
    productimage VARCHAR(500) NOT NULL,
    productprice DECIMAL(10,2) NOT NULL,
    categoryID INT,
    colourID INT,
    FOREIGN KEY (categoryID) REFERENCES categories(ID),
    FOREIGN KEY (colourID) REFERENCES colours(ID)
);

CREATE TABLE IF NOT EXISTS cart (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_user INT NOT NULL UNIQUE,
    FOREIGN KEY (id_user) REFERENCES users(ID)
);

CREATE TABLE IF NOT EXISTS cart_product (
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    variant_id INT NULL,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES cart(ID),
    FOREIGN KEY (product_id) REFERENCES products(ID)
);

CREATE TABLE IF NOT EXISTS orders (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    order_state VARCHAR(255),
    orderdate DATETIME,
    shipment_address VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES users(ID)
);

CREATE TABLE IF NOT EXISTS orders_products (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unity_price DECIMAL(10,2) NOT NULL,
    variant_id INT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(ID),
    FOREIGN KEY (product_id) REFERENCES products(ID)
);

CREATE TABLE IF NOT EXISTS shipment (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    shipping_company_id INT NOT NULL,
    shipment_address VARCHAR(255),
    shipment_date DATETIME,
    shipment_state VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(ID),
    FOREIGN KEY (shipping_company_id) REFERENCES shipping_companies(ID)
);

CREATE TABLE IF NOT EXISTS product_variants (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    chip VARCHAR(50),
    screen_size VARCHAR(10),
    storage VARCHAR(20) NOT NULL,
    memory VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(ID)
);

-- ===================== DATA =====================


INSERT INTO categories (categoryname, categorydescription) VALUES
('iPhone',    'Descubre nuestra selección de iPhone, la gama de smartphones de Apple que combina diseño, rendimiento y tecnología de vanguardia. Encuentra el modelo perfecto para ti: desde los más recientes hasta versiones anteriores al mejor precio'),
('iPad',      'Explora nuestra gama de iPad, las tabletas de Apple diseñadas para ofrecer potencia, versatilidad y una experiencia única. Desde el iPad básico hasta el iPad Pro, encuentra el modelo ideal para trabajar, estudiar o disfrutar de tu contenido favorito.'),
('MacBook',   'Descubre la potencia y elegancia de los Mac de Apple. Portátiles y ordenadores de escritorio diseñados para ofrecer un rendimiento excepcional, una experiencia fluida y un diseño inconfundible. Encuentra el Mac ideal para tu trabajo, tus estudios o tu día a día.'),
('Accesorios','Completa tu experiencia Apple con nuestra selección de accesorios originales y compatibles. Fundas, AirPods, cargadores, cables y más, diseñados para cuidar y potenciar tus dispositivos con el estilo y la calidad que caracterizan a Apple.');

-- iPhone (categoryID = 1)
INSERT INTO products (productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID) VALUES
('iPhone 17',         'La nueva generación de Apple con chip A19 y soporte para Apple Intelligence. Potencia y diseño en equilibrio.',                '8 GB',  '128 GB', 'images/iphone17.png',         899.00,  1),
('iPhone 17 Plus',    'Gran pantalla de 6.7", batería extendida y el rendimiento del chip A19.',                                                      '8 GB',  '256 GB', 'images/iphone17plus.png',     1049.00, 1),
('iPhone 17 Pro',     'Chip A19 Pro, cuerpo de titanio y cámaras de nivel profesional. Rendimiento sin concesiones.',                                 '8 GB',  '512 GB', 'images/iphone17pro.png',      1299.00, 1),
('iPhone 17 Pro Max', 'La experiencia definitiva: pantalla de 6.9", cámara avanzada y autonomía líder en el mercado.',                               '12 GB', '1 TB',   'images/iphone17promax.png',   1499.00, 1),
('iPhone 16',         'Chip A18 Bionic, cámara dual y diseño refinado. Ideal para el día a día con máximo rendimiento.',                              '6 GB',  '128 GB', 'images/iphone16.png',         799.00,  1),
('iPhone 16 Plus',    'Pantalla más grande y batería extendida con la potencia del A18.',                                                              '6 GB',  '256 GB', 'images/iphone16plus.png',     949.00,  1),
('iPhone 16 Pro',     'Rendimiento profesional con chip A18 Pro y pantalla ProMotion de 120 Hz.',                                                     '8 GB',  '512 GB', 'images/iphone16pro.png',      1199.00, 1),
('iPhone 16 Pro Max', 'La versión más potente de la gama 16 con zoom óptico 5x y pantalla de 6.7".',                                                 '12 GB', '1 TB',   'images/iphone16promax.png',   1399.00, 1),
('iPhone 15',         'Dynamic Island, USB-C y chip A16 Bionic. Diseño elegante y potente rendimiento.',                                              '6 GB',  '128 GB', 'images/iphone15.png',         749.00,  1),
('iPhone 15 Plus',    'Pantalla grande, gran batería y chip A16 Bionic. Ideal para quienes buscan autonomía y estilo.',                                '6 GB',  '256 GB', 'images/iphone15plus.png',     899.00,  1),
('iPhone 15 Pro',     'Cuerpo de titanio, chip A17 Pro y cámara triple profesional. El equilibrio perfecto entre potencia y diseño.',                 '8 GB',  '512 GB', 'images/iphone15pro.png',      1099.00, 1),
('iPhone 15 Pro Max', 'El tope de gama de 2023. Cámara periscópica, zoom óptico 5x y batería de larga duración.',                                    '12 GB', '1 TB',   'images/iphone15promax.png',   1299.00, 1),
('iPhone 14',         'Chip A15 Bionic, cámara mejorada y un diseño clásico que sigue destacando.',                                                   '6 GB',  '128 GB', 'images/iphone14.png',         649.00,  1),
('iPhone 14 Plus',    'Pantalla grande de 6.7" y autonomía sobresaliente. El equilibrio ideal de tamaño y potencia.',                                 '6 GB',  '256 GB', 'images/iphone14plus.png',     749.00,  1),
('iPhone 14 Pro',     'Dynamic Island, Always-On Display y chip A16 Bionic para un rendimiento superior.',                                            '8 GB',  '512 GB', 'images/iphone14pro.png',      899.00,  1),
('iPhone 14 Pro Max', 'Pantalla grande de 6.7", cámara profesional y batería extendida. Perfecto para los más exigentes.',                           '8 GB',  '1 TB',   'images/iphone14promax.png',   999.00,  1),
('iPhone 13',         'Chip A15 Bionic, cámara dual avanzada y pantalla OLED Super Retina XDR.',                                                      '4 GB',  '128 GB', 'images/iphone13.png',         549.00,  1),
('iPhone 13 mini',    'Toda la potencia del iPhone 13 en tamaño compacto. Ideal para quienes prefieren portabilidad.',                                '4 GB',  '128 GB', 'images/iphone13mini.png',     499.00,  1),
('iPhone 13 Pro',     'Pantalla ProMotion de 120 Hz y cámaras profesionales con modo cinemático.',                                                    '6 GB',  '512 GB', 'images/iphone13pro.png',      699.00,  1),
('iPhone 13 Pro Max', 'Gran pantalla de 6.7", batería de larga duración y rendimiento de gama alta.',                                                 '6 GB',  '1 TB',   'images/iphone13promax.png',   799.00,  1),
('iPhone 12',         'Chip A14 Bionic y pantalla OLED Super Retina XDR. Diseño elegante y duradero.',                                               '4 GB',  '128 GB', 'images/iphone12.png',         449.00,  1),
('iPhone 12 mini',    'Compacto y potente, con el mismo rendimiento que el iPhone 12 en un formato más pequeño.',                                     '4 GB',  '128 GB', 'images/iphone12mini.png',     399.00,  1),
('iPhone 12 Pro',     'Diseño de acero inoxidable, triple cámara y chip A14 Bionic. Rendimiento profesional.',                                        '6 GB',  '512 GB', 'images/iphone12pro.png',      499.00,  1),
('iPhone 12 Pro Max', 'El modelo más avanzado de la serie 12. Cámara con sensor más grande y pantalla de 6.7".',                                     '6 GB',  '1 TB',   'images/iphone12promax.png',   549.00,  1);

-- iPad (categoryID = 2)
INSERT INTO products (productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID) VALUES
('iPad Pro 13" (M4)',             'La tablet más potente de Apple, con pantalla Ultra Retina XDR, chip M4 y diseño ultrafino.',                          '16 GB', '1 TB',   'images/ipadpro13_m4.png',    1499.00, 2),
('iPad Pro 11" (M4)',             'Potencia profesional en formato compacto. Ideal para diseño, edición de vídeo o trabajo en movilidad.',               '8 GB',  '512 GB', 'images/ipadpro11_m4.png',    1249.00, 2),
('iPad Air 13" (M3)',             'Pantalla más grande, chip M3 ultrarrápido y compatibilidad con el nuevo Apple Pencil Pro.',                           '8 GB',  '512 GB', 'images/ipadair13_m3.png',     999.00, 2),
('iPad Air 11" (M3)',             'Ligero, rápido y potente. Perfecto para estudio, ocio o productividad en cualquier lugar.',                          '8 GB',  '256 GB', 'images/ipadair11_m3.png',     849.00, 2),
('iPad 10ª generación (256 GB)', 'El iPad más versátil. Pantalla de 10.9", USB-C y compatibilidad con Apple Pencil.',                                  '4 GB',  '256 GB', 'images/ipad10gen.png',        599.00, 2),
('iPad 10ª generación (64 GB)',  'Diseño moderno, ideal para estudiantes y uso diario. Pantalla de 10.9" y gran batería.',                             '4 GB',  '64 GB',  'images/ipad10gen64.png',      449.00, 2),
('iPad mini 7ª gen (256 GB)',    'Compacto y potente. Pantalla Liquid Retina de 8.3" y chip A17 Pro para máxima fluidez.',                             '6 GB',  '256 GB', 'images/ipadmini7.png',        699.00, 2),
('iPad mini 7ª gen (128 GB)',    'El iPad más pequeño y ligero, perfecto para lectura, viajes y productividad portátil.',                              '6 GB',  '128 GB', 'images/ipadmini7_128.png',    649.00, 2),
('iPad 9ª generación (128 GB)', 'Clásico y fiable. Pantalla Retina de 10.2", chip A13 Bionic y compatibilidad con Apple Pencil 1.',                   '3 GB',  '128 GB', 'images/ipad9gen.png',         429.00, 2),
('iPad 9ª generación (64 GB)',  'El iPad más asequible, ideal para tareas básicas, clases o entretenimiento.',                                         '3 GB',  '64 GB',  'images/ipad9gen64.png',       379.00, 2);

-- Mac (categoryID = 3)
INSERT INTO products (productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID) VALUES
('MacBook Air',    'El portátil más fino y ligero de Apple. Elige tu chip, pantalla y almacenamiento para la configuración ideal.',                    '8 GB',  '256 GB', 'images/macbookair13_m4.png', 1299.00, 3),
('MacBook Pro',    'Potencia profesional en formato portátil. Configura tu chip, pantalla y almacenamiento para un rendimiento sin límites.',          '18 GB', '512 GB', 'images/macbookpro.png',    2099.00, 3),
('iMac',           'Todo en uno con pantalla Retina de alta resolución y chip Apple Silicon. Elige tu configuración.',                                 '8 GB',  '256 GB', 'images/imac.png',          1599.00, 3),
('Mac mini (M3)',   'Potencia de escritorio en tamaño compacto. Chip M3 y múltiples opciones de conexión.',                                           '8 GB',  '256 GB', 'images/macmini_m3.png',     749.00, 3),
('Mac Studio (M4 Ultra)', 'Estación de trabajo compacta con chip M4 Ultra y rendimiento extremo para profesionales.',                                 '64 GB', '2 TB',   'images/macstudio_m4ultra.png', 4199.00, 3);

-- Accesorios (categoryID = 4)
INSERT INTO products (productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID) VALUES
('AirPods Pro (2ª gen, USB-C)',          'Auriculares con cancelación activa de ruido, audio espacial y estuche MagSafe USB-C.',                   'N/A', 'N/A', 'images/airpodspro2_usbc.png',          279.00, 4),
('AirPods (3ª generación)',              'Diseño ergonómico, sonido envolvente y hasta 6 horas de reproducción con una sola carga.',               'N/A', 'N/A', 'images/airpods3.png',                  199.00, 4),
('AirPods Max',                          'Auriculares circumaurales de alta fidelidad con cancelación activa de ruido y diseño premium.',           'N/A', 'N/A', 'images/airpodsmax.png',                629.00, 4),
('Funda silicona iPhone 17 Pro Max',     'Protección elegante y suave al tacto, compatible con carga inalámbrica MagSafe.',                        'N/A', 'N/A', 'images/funda_iphone17promax.png',       69.00, 4),
('Smart Folio iPad Pro 13" (M4)',        'Funda magnética que protege la pantalla y activa el modo reposo automáticamente.',                        'N/A', 'N/A', 'images/smartfolio_ipadpro13.png',       99.00, 4),
('Funda cuero MacBook Air 13"',          'Protege tu MacBook Air con estilo. Fabricada en cuero de primera calidad con forro interior suave.',     'N/A', 'N/A', 'images/funda_macbookair13.png',        129.00, 4),
('Cargador MagSafe (15W)',               'Carga inalámbrica rápida y segura para iPhone y AirPods. Se acopla magnéticamente.',                     'N/A', 'N/A', 'images/magsafe_charger.png',            49.00, 4),
('Cargador MagSafe Duo',                 'Base de carga doble para iPhone y Apple Watch o AirPods simultáneamente.',                               'N/A', 'N/A', 'images/magsafe_duo.png',               149.00, 4),
('Adaptador USB-C 35W',                  'Cargador rápido dual para cargar dos dispositivos Apple a la vez.',                                      'N/A', 'N/A', 'images/usb_c_35w.png',                  69.00, 4),
('Magic Keyboard con Touch ID',          'Teclado inalámbrico con sensor Touch ID, diseñado para los Mac con chip Apple Silicon.',                 'N/A', 'N/A', 'images/magickeyboard_touchid.png',     179.00, 4),
('Magic Mouse 3',                        'Ratón inalámbrico con superficie multitáctil, batería recargable y diseño minimalista.',                 'N/A', 'N/A', 'images/magicmouse3.png',                99.00, 4),
('Magic Trackpad 2',                     'Superficie táctil multitouch para gestos avanzados en macOS. Ideal para diseñadores y creadores.',       'N/A', 'N/A', 'images/magictrackpad2.png',            149.00, 4),
('Apple Pencil Pro',                     'Lápiz digital con sensibilidad a la presión, respuesta háptica y soporte para rotación 3D.',             'N/A', 'N/A', 'images/applepencilpro.png',            149.00, 4),
('Apple Pencil (USB-C)',                 'Lápiz preciso y asequible compatible con iPad (10ª generación) y posteriores.',                          'N/A', 'N/A', 'images/applepencil_usbc.png',           89.00, 4),
('Apple Watch Ultra 2',                  'Reloj inteligente de alto rendimiento con GPS de precisión, caja de titanio y resistencia 100 m.',       'N/A', 'N/A', 'images/applewatchultra2.png',          899.00, 4),
('Correa Loop deportiva 45mm',           'Correa transpirable y ligera, perfecta para entrenamientos o uso diario.',                               'N/A', 'N/A', 'images/correa_loop_verde45.png',        59.00, 4);

-- MacBook Air variants (chip · pantalla · almacenamiento)
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '13"', '256 GB', '8 GB',  1299.00 FROM products WHERE productname = 'MacBook Air';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '13"', '512 GB', '8 GB',  1499.00 FROM products WHERE productname = 'MacBook Air';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '13"', '1 TB',   '16 GB', 1699.00 FROM products WHERE productname = 'MacBook Air';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '15"', '256 GB', '8 GB',  1399.00 FROM products WHERE productname = 'MacBook Air';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '15"', '512 GB', '8 GB',  1599.00 FROM products WHERE productname = 'MacBook Air';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '15"', '1 TB',   '16 GB', 1799.00 FROM products WHERE productname = 'MacBook Air';

-- MacBook Pro variants (chip · pantalla · almacenamiento)
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Pro', '14"', '512 GB', '18 GB', 2099.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Pro', '14"', '1 TB',   '24 GB', 2399.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Pro', '14"', '2 TB',   '24 GB', 2699.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Pro', '14"', '512 GB', '18 GB', 2399.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Pro', '14"', '1 TB',   '24 GB', 2699.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Pro', '14"', '2 TB',   '24 GB', 2999.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Max', '16"', '1 TB',   '36 GB', 2999.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Max', '16"', '2 TB',   '36 GB', 3299.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4 Max', '16"', '4 TB',   '48 GB', 3699.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Max', '16"', '1 TB',   '48 GB', 3499.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Max', '16"', '2 TB',   '48 GB', 3799.00 FROM products WHERE productname = 'MacBook Pro';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M5 Max', '16"', '4 TB',   '64 GB', 4199.00 FROM products WHERE productname = 'MacBook Pro';

-- iMac variants (chip · pantalla · almacenamiento)
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M3', '24"', '256 GB', '8 GB',  1599.00 FROM products WHERE productname = 'iMac';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M3', '24"', '512 GB', '8 GB',  1749.00 FROM products WHERE productname = 'iMac';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M3', '24"', '1 TB',   '16 GB', 1899.00 FROM products WHERE productname = 'iMac';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '27"', '512 GB', '16 GB', 2199.00 FROM products WHERE productname = 'iMac';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '27"', '1 TB',   '24 GB', 2499.00 FROM products WHERE productname = 'iMac';
INSERT INTO product_variants (product_id, chip, screen_size, storage, memory, price) SELECT ID, 'M4', '27"', '2 TB',   '32 GB', 2799.00 FROM products WHERE productname = 'iMac';
