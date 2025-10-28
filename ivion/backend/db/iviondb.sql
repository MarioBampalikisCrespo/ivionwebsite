DROP SCHEMA IF EXISTS iviondb;

CREATE SCHEMA IF NOT EXISTS iviondb;
USE iviondb;

CREATE TABLE IF NOT EXISTS users (
	ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    usersurnames VARCHAR(255),
    userpassword VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
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

CREATE TABLE IF NOT EXISTS iphonecolours (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    colourname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ipadcolours (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    colourname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS maccolours (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    colourname VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS products (
	ID INT AUTO_INCREMENT PRIMARY KEY,
    productname VARCHAR(255) NOT NULL,
    productdescription VARCHAR(255) NOT NULL,
    productmemory VARCHAR(255) NOT NULL,
    productstorage VARCHAR(255) NOT NULL,
    productimage BLOB NOT NULL,
    productprice VARCHAR(255) NOT NULL,
    categoryID INT,
    coloriPhoneID INT,
    coloriPadID INT,
    colorMacID INT,
    FOREIGN KEY (categoryID) REFERENCES categories(ID),
    FOREIGN KEY (coloriPadID) REFERENCES ipadcolours(ID),
    FOREIGN KEY (colorMacID) REFERENCES maccolours(ID)
);

CREATE TABLE IF NOT EXISTS cart (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    total FLOAT NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(ID)
);

CREATE TABLE IF NOT EXISTS cart_product (
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES cart(ID),
    FOREIGN KEY (product_id) REFERENCES products(ID)
);

CREATE TABLE IF NOT EXISTS orders (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    order_state VARCHAR(255),
    orderdate VARCHAR(255),
    shipment_address VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES users(ID)
);

CREATE TABLE IF NOT EXISTS orders_products (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unity_price FLOAT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(ID),
    FOREIGN KEY (product_id) REFERENCES products(ID)
);

CREATE TABLE IF NOT EXISTS shipment (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    shipping_company_id INT NOT NULL,
    shipment_address VARCHAR(255),
    shipment_date VARCHAR(255),
    shipment_state VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(ID),
    FOREIGN KEY (shipping_company_id) REFERENCES shipping_companies(ID)
);

INSERT INTO users (username, usersurnames, userpassword, email) VALUES ("Mario", "Bampalikis Crespo", "bampalikis", "bampa.cres.mario@gmail.com");

INSERT INTO categories (categoryname, categorydescription) VALUES ("iPhone", "Descubre nuestra selección de iPhone, la gama de smartphones de Apple que combina diseño, rendimiento y tecnología de vanguardia. Encuentra el modelo perfecto para ti: desde los más recientes hasta versiones anteriores al mejor precio");
INSERT INTO categories (categoryname, categorydescription) VALUES ("iPad", "Explora nuestra gama de iPad, las tabletas de Apple diseñadas para ofrecer potencia, versatilidad y una experiencia única. Desde el iPad básico hasta el iPad Pro, encuentra el modelo ideal para trabajar, estudiar o disfrutar de tu contenido favorito.");
INSERT INTO categories (categoryname, categorydescription) VALUES ("MacBook", "Descubre la potencia y elegancia de los Mac de Apple. Portátiles y ordenadores de escritorio diseñados para ofrecer un rendimiento excepcional, una experiencia fluida y un diseño inconfundible. Encuentra el Mac ideal para tu trabajo, tus estudios o tu día a día.");
INSERT INTO categories (categoryname, categorydescription) VALUES ("Accesorios", "Completa tu experiencia Apple con nuestra selección de accesorios originales y compatibles. Fundas, AirPods, cargadores, cables y más, diseñados para cuidar y potenciar tus dispositivos con el estilo y la calidad que caracterizan a Apple.");


-- 📱 CATEGORÍA iPhone (categoryID = 1)
INSERT INTO products 
(productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID, coloriPhoneID, coloriPadID, colorMacID)
VALUES
-- iPhone 17 Series
("iPhone 17", 
 "La nueva generación de Apple con chip A19 y soporte para Apple Intelligence. Potencia y diseño en equilibrio.", 
 "8 GB", "128 GB", 
 "images/iphone17.jpg", 
 "899.00", 1, NULL, NULL, NULL),

("iPhone 17 Plus", 
 "Gran pantalla de 6.7”, batería extendida y el rendimiento del chip A19.", 
 "8 GB", "256 GB", 
 "images/iphone17plus.jpg", 
 "1049.00", 1, NULL, NULL, NULL),

("iPhone 17 Pro", 
 "Chip A19 Pro, cuerpo de titanio y cámaras de nivel profesional. Rendimiento sin concesiones.", 
 "8 GB", "512 GB", 
 "images/iphone17pro.jpg", 
 "1299.00", 1, NULL, NULL, NULL),

("iPhone 17 Pro Max", 
 "La experiencia definitiva: pantalla de 6.9”, cámara avanzada y autonomía líder en el mercado.", 
 "12 GB", "1 TB", 
 "images/iphone17promax.jpg", 
 "1499.00", 1, NULL, NULL, NULL),

-- iPhone 16 Series
("iPhone 16", 
 "Chip A18 Bionic, cámara dual y diseño refinado. Ideal para el día a día con máximo rendimiento.", 
 "6 GB", "128 GB", 
 "images/iphone16.jpg", 
 "799.00", 1, NULL, NULL, NULL),

("iPhone 16 Plus", 
 "Pantalla más grande y batería extendida con la potencia del A18.", 
 "6 GB", "256 GB", 
 "images/iphone16plus.jpg", 
 "949.00", 1, NULL, NULL, NULL),

("iPhone 16 Pro", 
 "Rendimiento profesional con chip A18 Pro y pantalla ProMotion de 120 Hz.", 
 "8 GB", "512 GB", 
 "images/iphone16pro.jpg", 
 "1199.00", 1, NULL, NULL, NULL),

("iPhone 16 Pro Max", 
 "La versión más potente de la gama 16 con zoom óptico 5x y pantalla de 6.7”.", 
 "12 GB", "1 TB", 
 "images/iphone16promax.jpg", 
 "1399.00", 1, NULL, NULL, NULL),

-- iPhone 15 Series
("iPhone 15", 
 "Dynamic Island, USB-C y chip A16 Bionic. Diseño elegante y potente rendimiento.", 
 "6 GB", "128 GB", 
 "images/iphone15.jpg", 
 "749.00", 1, NULL, NULL, NULL),

("iPhone 15 Plus", 
 "Pantalla grande, gran batería y chip A16 Bionic. Ideal para quienes buscan autonomía y estilo.", 
 "6 GB", "256 GB", 
 "images/iphone15plus.jpg", 
 "899.00", 1, NULL, NULL, NULL),

("iPhone 15 Pro", 
 "Cuerpo de titanio, chip A17 Pro y cámara triple profesional. El equilibrio perfecto entre potencia y diseño.", 
 "8 GB", "512 GB", 
 "images/iphone15pro.jpg", 
 "1099.00", 1, NULL, NULL, NULL),

("iPhone 15 Pro Max", 
 "El tope de gama de 2023. Cámara periscópica, zoom óptico 5x y batería de larga duración.", 
 "12 GB", "1 TB", 
 "images/iphone15promax.jpg", 
 "1299.00", 1, NULL, NULL, NULL),

-- iPhone 14 Series
("iPhone 14", 
 "Chip A15 Bionic, cámara mejorada y un diseño clásico que sigue destacando.", 
 "6 GB", "128 GB", 
 "images/iphone14.jpg", 
 "649.00", 1, NULL, NULL, NULL),

("iPhone 14 Plus", 
 "Pantalla grande de 6.7” y autonomía sobresaliente. El equilibrio ideal de tamaño y potencia.", 
 "6 GB", "256 GB", 
 "images/iphone14plus.jpg", 
 "749.00", 1, NULL, NULL, NULL),

("iPhone 14 Pro", 
 "Dynamic Island, Always-On Display y chip A16 Bionic para un rendimiento superior.", 
 "8 GB", "512 GB", 
 "images/iphone14pro.jpg", 
 "899.00", 1, NULL, NULL, NULL),

("iPhone 14 Pro Max", 
 "Pantalla grande de 6.7”, cámara profesional y batería extendida. Perfecto para los más exigentes.", 
 "8 GB", "1 TB", 
 "images/iphone14promax.jpg", 
 "999.00", 1, NULL, NULL, NULL),

-- iPhone 13 Series
("iPhone 13", 
 "Chip A15 Bionic, cámara dual avanzada y pantalla OLED Super Retina XDR.", 
 "4 GB", "128 GB", 
 "images/iphone13.jpg", 
 "549.00", 1, NULL, NULL, NULL),

("iPhone 13 mini", 
 "Toda la potencia del iPhone 13 en tamaño compacto. Ideal para quienes prefieren portabilidad.", 
 "4 GB", "128 GB", 
 "images/iphone13mini.jpg", 
 "499.00", 1, NULL, NULL, NULL),

("iPhone 13 Pro", 
 "Pantalla ProMotion de 120 Hz y cámaras profesionales con modo cinemático.", 
 "6 GB", "512 GB", 
 "images/iphone13pro.jpg", 
 "699.00", 1, NULL, NULL, NULL),

("iPhone 13 Pro Max", 
 "Gran pantalla de 6.7”, batería de larga duración y rendimiento de gama alta.", 
 "6 GB", "1 TB", 
 "images/iphone13promax.jpg", 
 "799.00", 1, NULL, NULL, NULL),

-- iPhone 12 Series
("iPhone 12", 
 "Chip A14 Bionic y pantalla OLED Super Retina XDR. Diseño elegante y duradero.", 
 "4 GB", "128 GB", 
 "images/iphone12.jpg", 
 "449.00", 1, NULL, NULL, NULL),

("iPhone 12 mini", 
 "Compacto y potente, con el mismo rendimiento que el iPhone 12 en un formato más pequeño.", 
 "4 GB", "128 GB", 
 "images/iphone12mini.jpg", 
 "399.00", 1, NULL, NULL, NULL),

("iPhone 12 Pro", 
 "Diseño de acero inoxidable, triple cámara y chip A14 Bionic. Rendimiento profesional.", 
 "6 GB", "512 GB", 
 "images/iphone12pro.jpg", 
 "499.00", 1, NULL, NULL, NULL),

("iPhone 12 Pro Max", 
 "El modelo más avanzado de la serie 12. Cámara con sensor más grande y pantalla de 6.7”.", 
 "6 GB", "1 TB", 
 "images/iphone12promax.jpg", 
 "549.00", 1, NULL, NULL, NULL);


-- CATEGORÍA iPad (categoryID = 2)
INSERT INTO products 
(productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID, coloriPadID, coloriPhoneID, colorMacID)
VALUES

-- iPad Pro (M4)
("iPad Pro 13\" (M4)", 
 "La tablet más potente de Apple, con pantalla Ultra Retina XDR, chip M4 y diseño ultrafino de aluminio reciclado.", 
 "16 GB", "1 TB", 
 "images/ipadpro13_m4.jpg", 
 "1499.00", 2, NULL, NULL, NULL),

("iPad Pro 11\" (M4)", 
 "Potencia profesional en formato compacto. Ideal para diseño, edición de vídeo o trabajo en movilidad.", 
 "8 GB", "512 GB", 
 "images/ipadpro11_m4.jpg", 
 "1249.00", 2, NULL, NULL, NULL),

-- iPad Air (M3)
("iPad Air 13\" (M3)", 
 "Pantalla más grande, chip M3 ultrarrápido y compatibilidad con el nuevo Apple Pencil Pro.", 
 "8 GB", "512 GB", 
 "images/ipadair13_m3.jpg", 
 "999.00", 2, NULL, NULL, NULL),

("iPad Air 11\" (M3)", 
 "Ligero, rápido y potente. Perfecto para estudio, ocio o productividad en cualquier lugar.", 
 "8 GB", "256 GB", 
 "images/ipadair11_m3.jpg", 
 "849.00", 2, NULL, NULL, NULL),

-- iPad (10ª generación)
("iPad 10ª generación (2024)", 
 "El iPad más versátil. Pantalla de 10.9”, USB-C y compatibilidad con Apple Pencil. Perfecto para todo tipo de tareas.", 
 "4 GB", "256 GB", 
 "images/ipad10gen.jpg", 
 "599.00", 2, NULL, NULL, NULL),

("iPad 10ª generación (64 GB)", 
 "Diseño moderno, ideal para estudiantes y uso diario. Pantalla de 10.9” y gran batería.", 
 "4 GB", "64 GB", 
 "images/ipad10gen64.jpg", 
 "449.00", 2, NULL, NULL, NULL),

-- iPad mini (7ª generación)
("iPad mini (7ª generación)", 
 "Compacto y potente. Pantalla Liquid Retina de 8.3” y chip A17 Pro para máxima fluidez.", 
 "6 GB", "256 GB", 
 "images/ipadmini7.jpg", 
 "699.00", 2, NULL, NULL, NULL),

("iPad mini (7ª generación, 128 GB)", 
 "El iPad más pequeño y ligero, perfecto para lectura, viajes y productividad portátil.", 
 "6 GB", "128 GB", 
 "images/ipadmini7_128.jpg", 
 "649.00", 2, NULL, NULL, NULL),

-- iPad (9ª generación) – aún se vende en algunas regiones
("iPad 9ª generación", 
 "Clásico y fiable. Pantalla Retina de 10.2”, chip A13 Bionic y compatibilidad con Apple Pencil 1.", 
 "3 GB", "128 GB", 
 "images/ipad9gen.jpg", 
 "429.00", 2, NULL, NULL, NULL),

("iPad 9ª generación (64 GB)", 
 "El iPad más asequible, ideal para tareas básicas, clases o entretenimiento.", 
 "3 GB", "64 GB", 
 "images/ipad9gen64.jpg", 
 "379.00", 2, NULL, NULL, NULL);


-- 💻 CATEGORÍA Mac (categoryID = 3)
INSERT INTO products 
(productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID, colorMacID, coloriPadID, coloriPhoneID)
VALUES

-- MacBook Air (M4)
("MacBook Air 13\" (M4)", 
 "El portátil más fino y ligero de Apple, con chip M4, gran autonomía y pantalla Liquid Retina.", 
 "8 GB", "256 GB", 
 "images/macbookair13_m4.jpg", 
 "1299.00", 3, NULL, NULL, NULL),

("MacBook Air 13\" (M4, 512 GB)", 
 "Versión ampliada del MacBook Air M4 con más almacenamiento y misma ligereza.", 
 "8 GB", "512 GB", 
 "images/macbookair13_m4_512.jpg", 
 "1499.00", 3, NULL, NULL, NULL),

("MacBook Air 15\" (M4)", 
 "Pantalla de 15.3”, chip M4 y batería de hasta 18 horas. Ideal para trabajar o crear en cualquier lugar.", 
 "8 GB", "512 GB", 
 "images/macbookair15_m4.jpg", 
 "1599.00", 3, NULL, NULL, NULL),

-- MacBook Pro (M4 / M5)
("MacBook Pro 14\" (M4 Pro)", 
 "Rendimiento profesional con chip M4 Pro, pantalla Liquid Retina XDR y diseño de aluminio reciclado.", 
 "18 GB", "512 GB", 
 "images/macbookpro14_m4pro.jpg", 
 "2099.00", 3, NULL, NULL, NULL),

("MacBook Pro 14\" (M5 Pro)", 
 "Versión 2025 del MacBook Pro con chip M5 Pro, el doble de eficiencia y un rendimiento gráfico superior.", 
 "18 GB", "1 TB", 
 "images/macbookpro14_m5pro.jpg", 
 "2399.00", 3, NULL, NULL, NULL),

("MacBook Pro 16\" (M4 Max)", 
 "El MacBook Pro más potente hasta la fecha. Chip M4 Max, 40 GB de memoria y pantalla XDR de 16”.", 
 "40 GB", "1 TB", 
 "images/macbookpro16_m4max.jpg", 
 "2999.00", 3, NULL, NULL, NULL),

("MacBook Pro 16\" (M5 Max)", 
 "La versión 2025 con el nuevo chip M5 Max, rendimiento extremo y refrigeración mejorada.", 
 "48 GB", "2 TB", 
 "images/macbookpro16_m5max.jpg", 
 "3499.00", 3, NULL, NULL, NULL),

-- iMac (M3 / M4)
("iMac 24\" (M3)", 
 "Todo en uno con chip M3, pantalla Retina 4.5K y diseño ultrafino en colores vibrantes.", 
 "8 GB", "256 GB", 
 "images/imac24_m3.jpg", 
 "1599.00", 3, NULL, NULL, NULL),

("iMac 24\" (M3, 16 GB / 1 TB)", 
 "Configuración ampliada del iMac con más memoria y almacenamiento para tareas exigentes.", 
 "16 GB", "1 TB", 
 "images/imac24_m3_1tb.jpg", 
 "1899.00", 3, NULL, NULL, NULL),

("iMac 27\" (M4)", 
 "El nuevo iMac 27” con chip M4 y pantalla Retina 5K. Ideal para profesionales de diseño y vídeo.", 
 "24 GB", "1 TB", 
 "images/imac27_m4.jpg", 
 "2499.00", 3, NULL, NULL, NULL),

("Mac mini (M3)", 
 "Potencia de escritorio en tamaño compacto. Chip M3 y múltiples opciones de conexión.", 
 "8 GB", "256 GB", 
 "images/macmini_m3.jpg", 
 "749.00", 3, NULL, NULL, NULL),

("Mac Studio (M4 Ultra)", 
 "Estación de trabajo compacta con chip M4 Ultra y rendimiento extremo para profesionales.", 
 "64 GB", "2 TB", 
 "images/macstudio_m4ultra.jpg", 
 "4199.00", 3, NULL, NULL, NULL);

-- 🎧⚡ CATEGORÍA Accesorios (categoryID = 4)
INSERT INTO products 
(productname, productdescription, productmemory, productstorage, productimage, productprice, categoryID, colorMacID, coloriPadID, coloriPhoneID)
VALUES

-- AirPods
("AirPods Pro (2ª generación, USB-C)", 
 "Auriculares con cancelación activa de ruido, audio espacial y estuche de carga MagSafe con USB-C.", 
 "N/A", "N/A", 
 "images/airpodspro2_usbc.jpg", 
 "279.00", 4, NULL, NULL, NULL),

("AirPods (3ª generación)", 
 "Diseño ergonómico, sonido envolvente y hasta 6 horas de reproducción con una sola carga.", 
 "N/A", "N/A", 
 "images/airpods3.jpg", 
 "199.00", 4, NULL, NULL, NULL),

("AirPods Max", 
 "Auriculares circumaurales de alta fidelidad con cancelación activa de ruido y diseño premium en aluminio.", 
 "N/A", "N/A", 
 "images/airpodsmax.jpg", 
 "629.00", 4, NULL, NULL, NULL),

-- Fundas y protectores
("Funda de silicona para iPhone 17 Pro Max (MagSafe)", 
 "Protección elegante y suave al tacto, compatible con carga inalámbrica MagSafe.", 
 "N/A", "N/A", 
 "images/funda_iphone17promax.jpg", 
 "69.00", 4, NULL, NULL, NULL),

("Smart Folio para iPad Pro 13\" (M4)", 
 "Funda magnética que protege la pantalla y activa el modo reposo automáticamente.", 
 "N/A", "N/A", 
 "images/smartfolio_ipadpro13.jpg", 
 "99.00", 4, NULL, NULL, NULL),

("Funda de cuero para MacBook Air 13\"", 
 "Protege tu MacBook Air con estilo. Fabricada en cuero de primera calidad con forro interior suave.", 
 "N/A", "N/A", 
 "images/funda_macbookair13.jpg", 
 "129.00", 4, NULL, NULL, NULL),

-- Cargadores y energía
("Cargador MagSafe (15W)", 
 "Carga inalámbrica rápida y segura para iPhone y AirPods. Se acopla magnéticamente.", 
 "N/A", "N/A", 
 "images/magsafe_charger.jpg", 
 "49.00", 4, NULL, NULL, NULL),

("Cargador MagSafe Duo", 
 "Base de carga doble para iPhone y Apple Watch o AirPods simultáneamente.", 
 "N/A", "N/A", 
 "images/magsafe_duo.jpg", 
 "149.00", 4, NULL, NULL, NULL),

("Adaptador de corriente USB-C de 35 W", 
 "Cargador rápido dual para cargar dos dispositivos Apple a la vez.", 
 "N/A", "N/A", 
 "images/usb_c_35w.jpg", 
 "69.00", 4, NULL, NULL, NULL),

-- Teclados, ratones y stylus
("Magic Keyboard con Touch ID", 
 "Teclado inalámbrico con sensor Touch ID, diseñado para los Mac con chip Apple Silicon.", 
 "N/A", "N/A", 
 "images/magickeyboard_touchid.jpg", 
 "179.00", 4, NULL, NULL, NULL),

("Magic Mouse 3", 
 "Ratón inalámbrico con superficie multitáctil, batería recargable y diseño minimalista.", 
 "N/A", "N/A", 
 "images/magicmouse3.jpg", 
 "99.00", 4, NULL, NULL, NULL),

("Magic Trackpad 2", 
 "Superficie táctil multitouch para gestos avanzados en macOS. Ideal para diseñadores y creadores.", 
 "N/A", "N/A", 
 "images/magictrackpad2.jpg", 
 "149.00", 4, NULL, NULL, NULL),

("Apple Pencil Pro", 
 "Lápiz digital con sensibilidad a la presión, respuesta háptica y soporte para rotación 3D.", 
 "N/A", "N/A", 
 "images/applepencilpro.jpg", 
 "149.00", 4, NULL, NULL, NULL),

("Apple Pencil (USB-C)", 
 "Lápiz preciso y asequible compatible con iPad (10ª generación) y posteriores.", 
 "N/A", "N/A", 
 "images/applepencil_usbc.jpg", 
 "89.00", 4, NULL, NULL, NULL),

-- Accesorios para Apple Watch
("Apple Watch Ultra 2 (Correa naranja alpina)", 
 "Reloj inteligente de alto rendimiento con GPS de precisión, caja de titanio y resistencia al agua 100 m.", 
 "N/A", "N/A", 
 "images/applewatchultra2.jpg", 
 "899.00", 4, NULL, NULL, NULL),

("Correa Loop deportiva (Verde oliva, 45 mm)", 
 "Correa transpirable y ligera, perfecta para entrenamientos o uso diario.", 
 "N/A", "N/A", 
 "images/correa_loop_verde45.jpg", 
 "59.00", 4, NULL, NULL, NULL);

SELECT * FROM products;
SELECT * FROM users;