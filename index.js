const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // comunicacion
app.use(cors());
//----------------------------------------- MIS FUNCIONES -----------------------------------------
// ----------------------------------------- ELIMINAR TABLAS
const dropTables = async () => {
  try {
    await pool.query(`
        DROP TABLE IF EXISTS boletaDetalle CASCADE;
        DROP TABLE IF EXISTS boleta CASCADE;
        DROP TABLE IF EXISTS carritoDetalle CASCADE;
        DROP TABLE IF EXISTS carrito CASCADE;
        DROP TABLE IF EXISTS producto CASCADE;
        DROP TABLE IF EXISTS categoria CASCADE;
        DROP TABLE IF EXISTS usuario CASCADE;
        DROP TABLE IF EXISTS comuna CASCADE;
        DROP TABLE IF EXISTS region CASCADE;
        DROP TABLE IF EXISTS tipoUsuario CASCADE;
        DROP TABLE IF EXISTS metodoPago CASCADE;

        DROP TABLE IF EXISTS comentario CASCADE;
        DROP TABLE IF EXISTS restauranteGaleria CASCADE;
        DROP TABLE IF EXISTS restauranteTag CASCADE;
        DROP TABLE IF EXISTS tag CASCADE;
        DROP TABLE IF EXISTS restaurante CASCADE;
        DROP TABLE IF EXISTS cuenta CASCADE;
    `);
    console.log("Todas las tablas han sido eliminadas correctamente.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA REGION
const crearTablaRegion = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS region (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'region' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA COMUNA
const crearTablaComuna = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comuna (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        region_id INTEGER REFERENCES region(id) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'comuna' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA TIPO USUARIO
const crearTablaTipoUsu = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tipoUsuario (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'tipoUsuario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA USUARIO
const crearTablaUsuario = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        rut VARCHAR(12) UNIQUE NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL,
        clave VARCHAR(100) NOT NULL,
        fecha_nac DATE,
        telefono VARCHAR(15),
        direccion VARCHAR(255) NOT NULL,
        region_id INTEGER REFERENCES region(id) NOT NULL,
        comuna_id INTEGER REFERENCES comuna(id) NOT NULL,
        tipoUsuario_id INTEGER REFERENCES tipoUsuario(id) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'usuario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA CATEGORIA 
const crearTablaCategoria = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categoria (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'categoria' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA PRODUCTO
const crearTablaProducto = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS producto (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10) NOT NULL,
        image VARCHAR(255),
        category_id INTEGER REFERENCES categoria(id) NOT NULL,
        description TEXT NOT NULL,
        stock_actual INTEGER DEFAULT 0 NOT NULL,
        stock_critico INTEGER DEFAULT 0 NOT NULL,
        active BOOLEAN DEFAULT FALSE NOT NULL
      );
    `);
    console.log("Tabla 'producto' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA CARRITO
const crearTablaCarrito = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id) NOT NULL,
        estado VARCHAR(50) NOT NULL
      );
    `);
    console.log("Tabla 'carrito' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA CARRITO DETALLE
const crearTablaCarritoDetalle = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carritoDetalle (
        id SERIAL PRIMARY KEY,
        carrito_id INTEGER REFERENCES carrito(id) NOT NULL,
        producto_id INTEGER REFERENCES producto(id) NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10) NOT NULL,
        subtotal DECIMAL(10) NOT NULL
      );
    `);
    console.log("Tabla 'carritoDetalle' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA METODO PAGO
const crearTablaMetodoPago = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS metodoPago (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `);
    console.log("Tabla 'metodoPago' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA BOLETA
const crearTablaBoleta = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS boleta (
        id SERIAL PRIMARY KEY,
        numero_boleta VARCHAR(20) UNIQUE NOT NULL,
        usuario_id INTEGER REFERENCES usuario(id) NOT NULL,
        carrito_id INTEGER REFERENCES carrito(id) NOT NULL,
        metodoPago_id INTEGER REFERENCES metodoPago(id) NOT NULL,
        subtotal DECIMAL(10) NOT NULL,
        iva DECIMAL(10) NOT NULL,
        total DECIMAL(10) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        direccion_envio VARCHAR(255) NOT NULL,
        estado VARCHAR(50) NOT NULL
      );
    `);
    console.log("Tabla 'boleta' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA BOLETA DETALLE
const crearTablaBoletaDetalle = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS boletaDetalle (
        id SERIAL PRIMARY KEY,
        boleta_id INTEGER REFERENCES boleta(id) NOT NULL,
        producto_id INTEGER REFERENCES producto(id) NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10) NOT NULL,
        subtotal DECIMAL(10) NOT NULL
      );
    `);
    console.log("Tabla 'boletaDetalle' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- INYECCION DE DATOS -----------------------------------------
const inyeccionRegion = async () => {
  try {
    await pool.query(`
      INSERT INTO region (name) VALUES
        ('Región Metropolitana'),
        ('Región de Valparaíso'),
        ('Región del Biobío'),
        ('Región de Coquimbo'),
        ('Región de Los Lagos');
    `);
    console.log("Insert 'region' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionComuna = async () => {
  try {
    await pool.query(`
      INSERT INTO comuna (name, region_id) VALUES
        ('Cerrillos', 1),
        ('El Bosque', 1),
        ('La Cisterna', 1),
        ('La Pintana', 1),
        ('Las Condes', 1),
        ('Lo Barnechea', 1),
        ('Lo Espejo', 1),
        ('Quilicura', 1),
        ('Recoleta', 1),
        ('Santiago', 1),
        ('Vitacura', 1),
        ('Valparaíso', 2),
        ('Viña del Mar', 2),
        ('Quilpué', 2),
        ('Villa Alemana', 2),
        ('Concón', 2),
        ('San Antonio', 2),
        ('Limache', 2),
        ('Concepción', 3),
        ('Talcahuano', 3),
        ('San Pedro de la Paz', 3),
        ('Coronel', 3),
        ('Lota', 3),
        ('Chiguayante', 3),
        ('La Serena', 4),
        ('Coquimbo', 4),
        ('Ovalle', 4),
        ('Illapel', 4),
        ('Vicuña', 4),
        ('Puerto Montt', 5),
        ('Osorno', 5),
        ('Puerto Varas', 5),
        ('Llanquihue', 5),
        ('Castro', 5);
    `);
    console.log("Insert 'comuna' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionTipoUsu = async () => {
  try {
    await pool.query(`
      INSERT INTO tipoUsuario (name) VALUES
        ('Administrador'),
        ('Vendedor'),
        ('Cliente'),
        ('Dueño de Restaurante');
    `);
    console.log("Insert 'tipoUsuario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionUsuario = async () => {
  try {
    await pool.query(`
      INSERT INTO usuario (rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active) VALUES
        ('10.456.123-K', 'Martina' , 'Gómez Soto'    , 'martina.gomez@profesor.duoc.cl', '123', '1980-08-10', '+56987654321', 'Av. Manuel Montt 345', 1, 10, 1, TRUE),
        ('15.987.654-2', 'Javier'  , 'Rojas Pérez'   , 'javier.rojas@profesor.duoc.cl' , '123', '1979-04-25', '+56912345678', 'Calle Las Dunas 101' , 2, 12, 1, FALSE),
        ('17.111.222-3', 'Carolina', 'Díaz Lagos'    , 'carolina.diaz@gmail.cl'        , '123', '1972-01-05', '+56966667777', 'Av. Del Mar 500'     , 4, 25, 2, TRUE),
        ('16.400.500-1', 'Andrés'  , 'Sepúlveda Vera', 'andres.sepulveda@gmail.cl'     , '123', '1985-11-30', '+56944445555', 'Arturo Prat 800'     , 3, 19, 2, FALSE),
        ('18.555.444-6', 'Fernanda', 'Muñoz Salas'   , 'fernanda.m@duoc.com'           , '123', '2000-07-12', '+56922221111', 'Pje. Los Álamos 99'  , 1, 10, 3, TRUE),
        ('19.789.012-7', 'Roberto' , 'Tapia Bustos'  , 'roberto.t@duoc.com'            , '123', '2002-03-20', '+56933330000', 'Calle Mirador Sur 55', 5, 30, 3, FALSE);
    `);
    console.log("Insert 'usuario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionCategoria = async () => {
  try {
    await pool.query(`
      INSERT INTO categoria(name, active) VALUES
        ('Objetos Curativos', TRUE),
        ('Objetos Restaurador de estados', TRUE),
        ('Repelentes', TRUE),
        ('Poké balls', TRUE),
        ('Objetos de Exploración', TRUE),
        ('Objetos Evolutivos', TRUE),
        ('Objetos Clave', FALSE),
        ('Eteres y Elixires', FALSE);
    `);
    console.log("Insert 'categoria' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionProducto = async () => {
  try {
    await pool.query(`
      INSERT INTO producto(name, price, image, category_id, description, stock_actual, stock_critico, active) VALUES
      ('Poción', 200, 'https://images.wikidexcdn.net/mwuploads/wikidex/f/fd/latest/20230115173615/Poci%C3%B3n_EP.png', 1, 
      'Restaura 20 PS (puntos de salud) de la barra de vida de un Pokémon, lo que la convierte en la poción ideal para los Pokémon de muy bajo nivel, durante el comienzo de la aventura. Puede utilizarse tanto dentro y fuera de combate, y para ello simplemente hay que aplicarla sobre el Pokémon. Son sobre todo útiles para los entrenadores principiantes.', 50, 10, True),
      ('Superpoción', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/1/1a/latest/20230115173819/Superpoci%C3%B3n_EP.png', 1, 
      'Restaura 50 PS (puntos de salud) de la barra de vida de un Pokémon, lo que la convierte en la poción ideal para los Pokémon de bajo nivel, durante el comienzo de la aventura. Puede utilizarse tanto dentro y fuera de combate, y para ello simplemente hay que aplicarla sobre el Pokémon. Son sobre todo útiles para los entrenadores intermedios.', 30, 5, True),
      ('Hiper Poción', 800, 'https://images.wikidexcdn.net/mwuploads/wikidex/7/76/latest/20230115173900/Hiperpoci%C3%B3n_EP.png', 1, 
      'Restaura 200 PS (puntos de salud) de la barra de vida de un Pokémon, lo que la convierte en la poción ideal para los Pokémon de bajo nivel, durante el comienzo de la aventura. Puede utilizarse tanto dentro y fuera de combate, y para ello simplemente hay que aplicarla sobre el Pokémon. Son sobre todo útiles para los entrenadores intermedios.', 20, 10, True),
      ('Poción máxima', 1250, 'https://images.wikidexcdn.net/mwuploads/wikidex/1/1b/latest/20230115181246/Poci%C3%B3n_m%C3%A1xima_EP.png', 1, 
      'Restaura todos los PS (puntos de salud) de la barra de vida de un Pokémon, lo que la convierte en la poción ideal para los Pokémon de alto nivel, durante el final de la aventura. Puede utilizarse tanto dentro y fuera de combate, y para ello simplemente hay que aplicarla sobre el Pokémon. Son sobre todo útiles para los entrenadores avanzados.', 45, 10, True),
      ('Restaura todo', 2500, 'https://images.wikidexcdn.net/mwuploads/wikidex/4/40/latest/20230115181348/Restaurar_todo_EP.png', 1, 
      'Restaura todo los PS (puntos de salud) de la barra de vida de un Pokémon y ademas de curar todo tipo de estados negativos, lo que la convierte en la poción ideal para los Pokémon de alto nivel, durante el comienzo de la aventura. Puede utilizarse tanto dentro y fuera de combate, y para ello simplemente hay que aplicarla sobre el Pokémon. Son sobre todo útiles para los entrenadores avanzados.', 19, 10, True),
      ('Antidoto', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/8/80/latest/20230124231716/Ant%C3%ADdoto_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon de un envenenamiento. Este objeto es de un solo uso y se utiliza para eliminar el estado de envenenamiento o envenenamiento grave de un Pokémon, restaurando su salud progresivamente.', 2, 10, True),
      ('Antihielo', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/b/bf/latest/20230403225933/Antihielo_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon de una congelacino. Este objeto es de un solo uso y se utiliza para eliminar el estado de congelado de un Pokémon, restaurando su salud progresivamente.', 50, 10, True),
      ('Antiquemar', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/9/9b/latest/20230403235822/Antiquemar_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon de una quemadura. Este objeto es de un solo uso y se utiliza para eliminar el estado de quemado de un Pokémon, restaurando su salud progresivamente.', 45, 10, True),
      ('Antiparalizador', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/8/84/latest/20230131031050/Antiparalizador_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon de una paralisis. Este objeto es de un solo uso y se utiliza para eliminar el estado de paralizado de un Pokémon, restaurando su salud progresivamente.', 35, 10, True),
      ('Despertar', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/d/d6/latest/20230403230208/Despertar_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon dormido. Este objeto es de un solo uso y se utiliza para eliminar el estado de dormido de un Pokémon, restaurando su salud progresivamente.', 36, 10, True),
      ('Cura total', 1000, 'https://images.wikidexcdn.net/mwuploads/wikidex/d/df/latest/20230123181503/Cura_total_EP.png', 2, 
      'Medicamento en aerosol. Cura a un Pokémon de los estados negativos. Este objeto es de un solo uso y se utiliza para eliminar todos los estado negativos de un Pokémon, restaurando su salud progresivamente.', 29, 10, True),
      ('Repelente', 250, 'https://images.wikidexcdn.net/mwuploads/wikidex/4/49/latest/20231030185416/Repelente_EP.png', 3, 
      'Repelente en aerosol. Se usa para evitar que aparezcan Pokémones salvajes. Este objeto es de un solo uso y tiene una duracion baja.', 10, 10, True),
      ('Súper Repelente', 500, 'https://images.wikidexcdn.net/mwuploads/wikidex/e/e8/latest/20231030185528/Superrepelente_EP.png', 3, 
      'Repelente de alta duración que mantiene alejados a los Pokémon salvajes durante más tiempo. Ideal para travesías largas en zonas peligrosas.', 40, 10, True),
      ('Máximo Repelente', 700, 'https://images.wikidexcdn.net/mwuploads/wikidex/4/49/latest/20231030185508/Repelente_m%C3%A1ximo_EP.png', 3, 
      'El repelente más duradero. Evita los encuentros con Pokémon salvajes durante un tiempo prolongado. Muy útil para explorar cuevas y rutas extensas.', 30, 10, True),
      ('Poké Ball', 200, 'https://images.wikidexcdn.net/mwuploads/wikidex/6/6a/latest/20230115164405/Pok%C3%A9_Ball_EP.png', 4, 
      'Una cápsula para atrapar Pokémon. Tiene una tasa de captura estándar y es el tipo de Poké Ball más común, usada por la mayoría de entrenadores al comenzar su aventura.', 100, 20, True),
      ('Super Ball', 600, 'https://images.wikidexcdn.net/mwuploads/wikidex/3/3f/latest/20230115164421/Super_Ball_EP.png', 4, 
      'Una Poké Ball mejorada con una mayor tasa de captura que la Poké Ball normal. Ideal para entrenadores con algo más de experiencia.', 80, 15, True),
      ('Ultra Ball', 1200, 'https://images.wikidexcdn.net/mwuploads/wikidex/9/9f/latest/20230219232032/Ultra_Ball_EP.png', 4, 
      'Una Poké Ball de alta calidad con una tasa de captura muy superior. Perfecta para capturar Pokémon raros o difíciles de atrapar.', 60, 10, True),
      ('Cuerda Huida', 550, 'https://images.wikidexcdn.net/mwuploads/wikidex/f/f7/latest/20231004192615/Cuerda_huida_EP.png', 5, 
      'Una cuerda larga y resistente que permite escapar rápidamente de cuevas o mazmorras. Se consume al usarla.', 15, 5, True),
      ('Piedra Fuego', 2100, 'https://images.wikidexcdn.net/mwuploads/wikidex/8/86/latest/20230106130317/Piedra_fuego_EP.png', 6, 
      'Piedra especial que emite un cálido resplandor. Permite evolucionar ciertos Pokémon de tipo Fuego como Vulpix o Growlithe.', 10, 3, True),
      ('Piedra Agua', 2100, 'https://images.wikidexcdn.net/mwuploads/wikidex/1/14/latest/20230106130249/Piedra_agua_EP.png', 6, 
      'Piedra especial que brilla con un azul profundo. Permite evolucionar ciertos Pokémon de tipo Agua, como Poliwhirl o Staryu.', 12, 5, True),
      ('Piedra Hoja', 2100, 'https://images.wikidexcdn.net/mwuploads/wikidex/8/85/latest/20230106130605/Piedra_hoja_EP.png', 6, 
      'Piedra especial cubierta de un musgo verde intenso. Permite evolucionar ciertos Pokémon de tipo Planta, como Gloom o Exeggcute.', 8, 4, True),
      ('Piedra Trueno', 2100, 'https://images.wikidexcdn.net/mwuploads/wikidex/3/30/latest/20230106130335/Piedra_trueno_EP.png', 6, 
      'Piedra especial que crepita con electricidad estática. Permite evolucionar ciertos Pokémon de tipo Eléctrico, como Pikachu o Eevee.', 15, 6, True),
      ('Piedra Lunar', 3000, 'https://images.wikidexcdn.net/mwuploads/wikidex/4/40/latest/20230106130527/Piedra_lunar_EP.png', 6, 
      'Piedra especial que solo brilla bajo la luz de la luna llena. Permite evolucionar Pokémon únicos como Nidorina o Clefairy.', 15, 2, True),
      ('Piedra Solar', 3000, 'https://images.wikidexcdn.net/mwuploads/wikidex/1/13/latest/20230106130543/Piedra_solar_EP.png', 6, 
      'Piedra especial que emite un calor radiante, como un pequeño sol. Permite evolucionar ciertos Pokémon de tipo Planta y otros, como Sunkern o Cottonee.', 10, 3, True),
      ('Piedra Día', 2500, 'https://images.wikidexcdn.net/mwuploads/wikidex/2/2e/latest/20230106130754/Piedra_d%C3%ADa_EP.png', 6, 
      'Piedra especial que irradia energía durante el día. Permite evolucionar ciertos Pokémon de tipo Hada y otros, como Togetic o Roselia.', 14, 5, True);
    `);
    console.log("Insert 'producto' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionMetodoPago = async () => {
  try {
    await pool.query(`
      INSERT INTO metodoPago (name) VALUES
        ('Tarjeta Crédito'),
        ('Débito'),
        ('PayPal'),
        ('Transferencia Bancaria'),
        ('Efectivo');
    `);
    console.log("Insert 'metodoPago' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionCarrito = async () => {
  try {
    await pool.query(`
      INSERT INTO carrito (usuario_id, estado) VALUES
        (1, 'FINALIZADO'),
        (2, 'FINALIZADO');
    `);
    console.log("Insert 'Carrito' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionCarritoDetalle = async () => {
  try {
    await pool.query(`
      INSERT INTO carritoDetalle (carrito_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
        (1, 1, 2, 200, 400),
        (1, 2, 1, 500, 500),
        (1, 3, 1, 800, 800),
        (2, 1, 1, 200, 200),
        (2, 4, 1, 1250, 1250),
        (2, 5, 1, 2500, 2500);
    `);
    console.log("Insert 'Carrito Detalle' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionBoleta = async () => {
  try {
    await pool.query(`
      INSERT INTO boleta (numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado ) VALUES 
        ('BOL-0001', 1, 1, 1, 1700, 323, 2023, 'Pje. Los Álamos 99', 'PAGADA'),
        ('BOL-0002', 2, 2, 2, 3950, 751, 4701, 'Calle Mirador Sur 55', 'PAGADA');
    `);
    console.log("Insert 'Boleta' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
const inyeccionBoletaDetalle = async () => {
  try {
    await pool.query(`
      INSERT INTO boletaDetalle (boleta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
        (1, 1, 2, 200, 400),
        (1, 2, 1, 500, 500),
        (1, 3, 1, 800, 800),
        (2, 1, 1, 200, 200),
        (2, 4, 1, 1250, 1250),
        (2, 5, 1, 2500, 2500);
    `);
    console.log("Insert 'Boleta Detalle' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//-------------------------------------------------------------------------- TABLAS APP MOVIL
//----------------------------------------- TABLA CUENTA
const crearTablaCuenta = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS cuenta (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            correo VARCHAR(100) UNIQUE NOT NULL,
            clave VARCHAR(100) NOT NULL,
            tipousuario_id INTEGER REFERENCES tipoUsuario(id) NOT NULL,
            active BOOLEAN DEFAULT TRUE NOT NULL
        );
    `);
    console.log("Tabla 'cuenta' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA RESTAURANTE
const crearTablaRestaurante = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS restaurante (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            descripcion VARCHAR(200) NOT NULL,
            ubicacion VARCHAR(100) NOT NULL,
            latitud DECIMAL(10, 7),
            longitud DECIMAL(10, 7),
            telefono VARCHAR(15),
            correo VARCHAR(100) UNIQUE,
            imagenUrl VARCHAR(255) NOT NULL
        );
    `);
    console.log("Tabla 'restaurante' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA TAG
const crearTablaTag = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tag (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL
        );
    `);
    console.log("Tabla 'tag' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA TAG_RESTAURANTE
const crearTablaRestauranteTag = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS restauranteTag (
            restaurante_id INTEGER REFERENCES restaurante(id) NOT NULL,
            tag_id INTEGER REFERENCES tag(id) NOT NULL,
            PRIMARY KEY (restaurante_id, tag_id)
        );
    `);
    console.log("Tabla 'restauranteTag' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA TAG_RESTAURANTE
const crearTablaRestauranteGaleria = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS restauranteGaleria (
            restaurante_id INTEGER REFERENCES restaurante(id) NOT NULL,
            imagenUrl VARCHAR(255) NOT NULL
        );
    `);
    console.log("Tabla 'restauranteGaleria' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- TABLA COMENTARIO
const crearTablaComentario = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS comentario (
            id SERIAL PRIMARY KEY,
            usuario_id INTEGER REFERENCES cuenta(id) NOT NULL,
            restaurante_id INTEGER REFERENCES restaurante(id) NOT NULL,
            comentario TEXT,
            calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
            fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (usuario_id, restaurante_id)
        );
    `);
    console.log("Tabla 'comentario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- INYECCION DE APP MOVIL
const inyeccionCuenta = async () => {
  try {
    await pool.query(`
      INSERT INTO cuenta (nombre, correo, clave, tipousuario_id) VALUES
        ('Martina', 'martina.gomez@gmail.cl', '123', 3),
        ('Javier', 'javier.rojas@gmail.cl', '123', 3),
        ('Carolina', 'carolina.diaz@gmail.cl', '123', 3),
        ('Andres', 'andres.sepulveda@gmail.cl', '123', 3),
        ('Fernanda', 'fernanda.m@gmail.com', '123', 3),
        ('Roberto', 'roberto.t@gmail.com', '123', 3),
        ('Admin', 'admin@gmail.cl', '123', 1),
        ('Cafe Aroma', 'cafeAroma@gmail.cl', '123', 2);
    `);
    console.log("Insert 'cuenta' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};

const inyeccionRestaurante  = async () => {
  try {
    await pool.query(`
        INSERT INTO restaurante (nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl) VALUES
        ('Sushi Koi', 'Restaurante de comida japonesa y sushi fresco.', 'Providencia, Santiago', -33.4262800, -70.6200300, '222345678', 'contacto@sushikoi.cl', 'https://images.adsttc.com/media/images/5bf3/5d1c/08a5/e509/1100/014e/large_jpg/FEATURE_IMAGE.jpg?1542675707'),
        ('La Parrilla Don Pepe', 'Parrilladas y carnes a la brasa estilo chileno.', 'Maipú, Santiago', -33.5169100, -70.7579900, '227564321', 'donpepe@parrilla.cl', 'https://images.adsttc.com/media/images/5888/5449/e58e/ce61/eb00/015c/newsletter/Imagen_11.jpg?1485329469'),
        ('Veggie House', 'Comida vegetariana y vegana con ingredientes orgánicos.', 'Providencia, Santiago', -33.4319500, -70.6166700, '229876543', 'hola@veggiehouse.cl', 'https://cloudfront-us-east-1.images.arcpublishing.com/copesa/RDSW237XLFD5REMPICWUGY4KFI.jpg'),
        ('Pizzería La Toscana', 'Pizzas artesanales al estilo italiano.', 'Ñuñoa, Santiago', -33.4562000, -70.5997000, '223458765', 'contacto@latoscana.cl', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/1c/ce/e8/tenemos-mesas-al-aire.jpg?w=900&h=500&s=1'),
        ('Café Aroma', 'Cafetería con gran variedad de cafés y postres.', 'Las Condes, Santiago', -33.4102600, -70.5665600, '224563219', 'info@cafearoma.cl', 'https://www.latercera.com/resizer/v2/DNIX6TBYGRB5BOJSNABVADCTKY.jpg?auth=b105bf4baea33333c5e7bcfb67c3d4b6117b6b9169160a909155718a5a991474&width=1200&smart=true');
    `);
    console.log("Insert 'restaurante' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};

const inyeccionTag = async () => {
  try {
    await pool.query(`
        INSERT INTO tag (nombre) VALUES
        ('Comida Japonesa'),
        ('Delivery'),
        ('Familiar'),
        ('Vegano'),
        ('Pizzería');
    `);
    console.log("Insert 'tag' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};

const inyeccionRestauranteTag  = async () => {
  try {
    await pool.query(`
        INSERT INTO restauranteTag (restaurante_id, tag_id) VALUES
        (1, 1),
        (1, 2),
        (2, 3),
        (3, 4),
        (3, 2),
        (4, 5),
        (4, 3),
        (5, 3),
        (5, 2);
    `);
    console.log("Insert 'restauranteTag' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};

const inyeccionComentario  = async () => {
  try {
    await pool.query(`
        INSERT INTO comentario (usuario_id, restaurante_id, comentario, calificacion) VALUES
        (1, 1, 'Excelente sushi, muy fresco y buena atención.', 5),
        (2, 1, 'Buen sushi, pero los precios son un poco elevados. ', 4),
        (3, 1, 'Pedí delivery, rápido y llegó todo en orden. Calidad constante. ', 5),
        (4, 1, 'El lugar es agradable, pero la música estaba muy alta. ', 3),
        (5, 1, 'Lo mejor es la tempura de camarones, siempre vuelvo. ', 5),
        (6, 1, 'Fui con mi familia y el servicio fue lento, aunque la comida estaba bien. ', 3),
        (1, 2, 'La carne estaba al punto perfecto, jugosa y tierna. ', 5),
        (2, 2, 'Porciones muy grandes, ideal para compartir. El chimichurri es top. ', 4),
        (3, 2, 'Buena atención del personal. El postre de la casa es un acierto. ', 5),
        (4, 2, 'Carne sabrosa pero el local estaba muy lleno.', 3),
        (5, 2, 'Muy ruidoso, difícil conversar. La parrillada mixta es buena. ', 4),
        (6, 2, 'Simplemente la mejor entraña que he comido en Maipú. Imperdible. ', 5),
        (1, 3, 'Opciones saludables, frescas y muy bien presentadas. Volveré. ', 5),
        (2, 3, 'Buena comida vegana pero los tiempos de espera son largos.', 4),
        (3, 3, 'El mejor bowl de verduras que he probado, lleno de sabor. ', 4),
        (4, 3, 'Demoraron mucho en tomar el pedido. Falta personal. ', 3),
        (5, 3, 'El ambiente es tranquilo y acogedor, perfecto para leer. ', 4),
        (6, 3, 'A pesar de ser vegano, es muy gourmet. El hummus es excelente. ', 4),
        (1, 4, 'La masa es perfecta, estilo napolitano. La mejor pizza de Ñuñoa. ', 5),
        (2, 4, 'El tiramisú es espectacular, auténtico sabor italiano. ', 5),
        (3, 4, 'Las pizzas están quemada, se nota que son atentos.', 1),
        (4, 4, 'Buena relación precio/calidad, ideal para ir con amigos. ', 4),
        (5, 4, 'Mi pizza llegó fría a domicilio. Deben mejorar el transporte. ', 2),
        (6, 4, 'Mi lugar favorito para pedir pizza a domicilio, siempre llega crujiente. ', 5),
        (1, 5, 'Excelente lugar para una reunión de trabajo, muy tranquilo. ', 3),
        (2, 5, 'Probé el latte de temporada, muy rico y bien decorado. ', 5),
        (3, 5, 'Precios un poco altos, pero la calidad del grano lo justifica. ', 3),
        (4, 5, 'Los postres son imperdibles, especialmente el pie de limón. ', 5),
        (5, 5, 'El café es exquisito, ideal para estudiar o trabajar.', 5),
        (6, 5, 'Siempre voy por el pan de chocolate, es fresco y delicioso. ', 4);
    `);
    console.log("Insert 'comentario' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};

const inyeccionRestauranteGaleria  = async () => {
  try {
    await pool.query(`
        INSERT INTO restauranteGaleria (restaurante_id, imagenUrl) VALUES
        (1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8usUrU4524wv_DelZPLVfS2AAQV6AXU9-Sw&s'),
        (1, 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/64EF898D-2EDD-4B47-A456-E6A7D137AC91/Derivates/00f76cac-64f6-4573-be4f-e604a7d99143.jpg'),
        (2, 'https://www.carbonquebracho.cl/cdn/shop/articles/parrilla_perfecta.png?v=1673999832'),
        (2, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/f1/00/9a/te-esperamos.jpg?w=900&h=500&s=1'),
        (3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6wIvbYAvg0u5OB0v_WeXSe0rHelwCU_gqLA&s'),
        (3, 'https://media.pagina7.cl/2024/02/ruta-vegana-en-valdivia.jpg'),
        (4, 'https://easyways.cl/storage/20210610095707masa-de-pizza-2.0.jpg'),
        (4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJrciWk89zIsYeLZnR73vq43QcPIwKGrNcQQ&s'),
        (5, 'https://www.lavazzausa.com/content/dam/lavazza-athena/b2c/stories/article/coffee-secrets/how-to-make-flat-white-coffee/hero/m-HOW-TO-SLOT-1@2.jpg'),
        (5, 'https://gourmet.iprospect.cl/wp-content/uploads/2024/12/IRISH-CAFE.jpg');
    `);
    console.log("Insert 'restauranteGaleria' verificada.");

  } catch (err) {
    console.error("Error DB:", err);
  }
};
//----------------------------------------- CONFIGURACION INICIAL DB
const setupDB = async () => {
  try {
    console.log("Eliminando tablas...");
    await dropTables();

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Creando tablas...");
    await crearTablaRegion();// 1
    await crearTablaComuna();// 2
    await crearTablaMetodoPago();// 3
    await crearTablaTipoUsu();// 4
    await crearTablaUsuario();// 5 (Requiere 1, 2, 4)
    await crearTablaCategoria();// 6
    await crearTablaProducto();// 7 (Requiere 6)
    await crearTablaCarrito();// 8 (Requiere 5)
    await crearTablaCarritoDetalle();// 9 (Requiere 7, 8)
    await crearTablaBoleta();// 11 (Requiere 5, 8, 10)
    await crearTablaBoletaDetalle();// 12 (Requiere 7, 11)
    
    console.log("Inyectando datos...");
    await inyeccionRegion();
    await inyeccionComuna();
    await inyeccionMetodoPago();
    await inyeccionTipoUsu();
    await inyeccionCuenta();
    await inyeccionUsuario();
    await inyeccionCategoria();
    await inyeccionProducto();
    await inyeccionCarrito();
    await inyeccionCarritoDetalle();
    await inyeccionBoleta();
    await inyeccionBoletaDetalle();

    console.log("Creando tablas APP Movil...");
    await crearTablaCuenta();// 1
    await crearTablaRestaurante();// 2
    await crearTablaTag();// 3
    await crearTablaRestauranteTag();// 4 (Requiere 2, 3)
    await crearTablaComentario();// 5 (Requiere 1, 2)
    await crearTablaRestauranteGaleria();// 6 (Requiere 2)

    console.log("Inyectando datos APP Movil...");
    await inyeccionCuenta();
    await inyeccionRestaurante();
    await inyeccionTag();
    await inyeccionRestauranteTag();
    await inyeccionComentario();
    await inyeccionRestauranteGaleria();

    console.log("Database inicializada correctamente");
  } catch (err) {
    console.error("ERROR CRÍTICO en setupDB:");
    console.error("Tipo:", err.constructor.name);
    console.error("Mensaje:", err.message);
    console.error("Código:", err.code);
    console.error("Query que falló:", err.query);
    console.error("Stack completo:", err.stack);
    process.exit(1); // Detiene la app si falla
  }
};

setupDB();

// ----------------------------------------- ENDPOINTS -----------------------------------------
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto_temporal_12345';
// ----------------------------------------- ENDPOINTS APP MOVIL
// ----------------------------------------- ENDPOINTS CUENTA - ESTADO = OK
// LOGIN para APP MÓVIL (tabla: cuenta)
app.post('/auth/login', async (req, res) => {
  const { email, pass } = req.body;
  
  try {
    // 1. Buscar cuenta por correo y contraseña
    //const query = 'SELECT * FROM cuenta WHERE correo = $1 AND clave = $2';
    //const result = await pool.query(query, [email, pass]);

    // Modificado para solo buscar por correo y luego validar contraseña en código
    const query = 'SELECT * FROM cuenta WHERE correo = $1';
    const result = await pool.query(query, [email]);
    // Verificar si existe la cuenta
    if (result.rows.length === 0) {
      console.log('Cuenta inválida: correo no registrado');
      return res.status(401).json({ code: 'EMAIL_NOT_FOUND', message: 'La cuenta no está registrada' });
    }
    const cuenta = result.rows[0];
    // Verificamos si la cuenta está activa
    if( !cuenta.active ) {
      console.log('Cuenta inactiva:', cuenta.nombre);
      return res.status(403).json({ code: 'ACCOUNT_INACTIVE', message: 'La cuenta está inactiva. Contactese con soporte.' });
    }
    // Verificamos que la contraseña coincida
    if (cuenta.clave !== pass) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ code: 'INVALID_PASSWORD', message: 'La contraseña no es correcta' });
    }

    // 2. Generar token JWT
    const token = jwt.sign(
      { 
        id: cuenta.id,
        correo: cuenta.correo,
        nombre: cuenta.nombre,
        tipousuario_id: cuenta.tipousuario_id
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    console.log('Login exitoso:', cuenta.nombre);
    
    // 3. Devolver token + datos del usuario (SIN contraseña)
    res.json({
      token,
      user: {
        id: cuenta.id,
        nombre: cuenta.nombre,
        correo: cuenta.correo,
        tipousuario_id: cuenta.tipousuario_id,
        active: cuenta.active
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
// Obtener todas las cuentas
app.get('/cuentas', async (req, res) => {
  const result = await pool.query('SELECT * FROM cuenta');
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tabla Cuenta vacia' });
  }
  res.json(result.rows);
});
// Obtener una cuenta por ID
app.get('/cuentas/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM cuenta WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ code: 'CUENTA_NOT_FOUND', message: 'Cuenta no encontrada' });
  }
  res.json(result.rows[0]);
});
// Registrar nueva cuenta
app.post('/auth/register', async (req, res) => {
  const { nombre, correo, clave, tipousuario_id } = req.body;
  
  console.log('Register request:', { nombre, correo });
  
  try {
    // 1. Verificar si el correo ya existe
    const checkQuery = 'SELECT * FROM cuenta WHERE correo = $1';
    const checkResult = await pool.query(checkQuery, [correo]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ code: 'EMAIL_ALREADY_EXISTS', message: 'El correo ya está registrado' });
    }
    
    // 2. Crear nueva cuenta
    const insertQuery = `
      INSERT INTO cuenta (nombre, correo, clave, tipousuario_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [nombre, correo, clave, tipousuario_id]);
    const nuevaCuenta = result.rows[0];
    
    // 3. Generar token para login automático
    const token = jwt.sign(
      { 
        id: nuevaCuenta.id,
        correo: nuevaCuenta.correo,
        nombre: nuevaCuenta.nombre,
        tipousuario_id: nuevaCuenta.tipousuario_id
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    console.log('Registro exitoso:', nuevaCuenta.nombre);
    
    // 4. Devolver token + usuario
    res.status(201).json({
      token,
      user: {
        id: nuevaCuenta.id,
        nombre: nuevaCuenta.nombre,
        correo: nuevaCuenta.correo,
        tipousuario_id: nuevaCuenta.tipousuario_id,
        active: nuevaCuenta.active
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});
// Actualizar una cuenta existente
app.put('/cuentas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, clave, active, tipousuario_id } = req.body;
  try {
    // Verificar si el correo ya existe en OTRA cuenta
    const checkQuery = 'SELECT * FROM cuenta WHERE correo = $1 AND id != $2';
    const checkResult = await pool.query(checkQuery, [correo, id]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ 
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'El correo ya está en uso' 
      });
    }
    
    // Construir query dinámico según si hay clave o no
    let updateQuery;
    let values;
    
    if (clave && clave.trim() !== '') {
      // Actualizar CON nueva clave
      updateQuery = `
        UPDATE cuenta 
        SET nombre = $1, correo = $2, clave = $3, active = $4, tipousuario_id = $5 
        WHERE id = $6 
        RETURNING *
      `;
      values = [nombre, correo, clave, active, tipousuario_id, id];
    } else {
      // Actualizar SIN cambiar clave
      updateQuery = `
        UPDATE cuenta 
        SET nombre = $1, correo = $2, active = $3, tipousuario_id = $4 
        WHERE id = $5 
        RETURNING *
      `;
      values = [nombre, correo, active, tipousuario_id, id];
    }
    
    const result = await pool.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        code: 'CUENTA_NOT_FOUND',
        message: 'Cuenta no encontrada' 
      });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
// Eliminar una cuenta
app.delete('/cuentas/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM cuenta WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Cuenta no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS RESTAURANTE
app.get('/restaurantes', async (req, res) => {
  const result = await pool.query('SELECT * FROM restaurante');
  res.json(result.rows);
});

app.get('/restaurantes/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM restaurante WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Restaurante no encontrado' });
  }
  res.json(result.rows[0]);
});

app.post('/restaurantes', async (req, res) => {
  const { nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl } = req.body;

  const result = await pool.query(
    `INSERT INTO restaurante (nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/restaurantes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl } = req.body;

  const result = await pool.query(
    `UPDATE restaurante 
     SET nombre=$1, descripcion=$2, ubicacion=$3, latitud=$4, longitud=$5, telefono=$6, correo=$7, imagenUrl=$8
     WHERE id=$9 RETURNING *`,
    [nombre, descripcion, ubicacion, latitud, longitud, telefono, correo, imagenUrl, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Restaurante no encontrado' });
  }
  res.json(result.rows[0]);
});

app.delete('/restaurantes/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM restaurante WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Restaurante no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS TAG
app.get('/tags', async (req, res) => {
  const result = await pool.query('SELECT * FROM tag');
  res.json(result.rows);
});

app.get('/tags/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM tag WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tag no encontrado' });
  }
  res.json(result.rows[0]);
});

app.post('/tags', async (req, res) => {
  const { nombre } = req.body;
  const result = await pool.query(
    'INSERT INTO tag (nombre) VALUES ($1) RETURNING *',
    [nombre]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/tags/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const result = await pool.query(
    'UPDATE tag SET nombre = $1 WHERE id = $2 RETURNING *',
    [nombre, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tag no encontrado' });
  }
  res.json(result.rows[0]);
});

app.delete('/tags/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM tag WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tag no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS restauranteTag
// Obtener todos los tags asignados a restaurantes
app.get('/restauranteTags', async (req, res) => {
  const result = await pool.query('SELECT * FROM restauranteTag');
  res.json(result.rows);
});

// Asignar tag a restaurante
app.post('/restauranteTags', async (req, res) => {
  const { restaurante_id, tag_id } = req.body;

  const result = await pool.query(
    'INSERT INTO restauranteTag (restaurante_id, tag_id) VALUES ($1, $2) RETURNING *',
    [restaurante_id, tag_id]
  );
  res.status(201).json(result.rows[0]);
});

// Eliminar relación restaurante-tag
app.delete('/restauranteTags', async (req, res) => {
  const { restaurante_id, tag_id } = req.body;

  const result = await pool.query(
    'DELETE FROM restauranteTag WHERE restaurante_id = $1 AND tag_id = $2 RETURNING *',
    [restaurante_id, tag_id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Relación no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS restauranteGaleria
app.get('/restauranteGaleria/:restaurante_id', async (req, res) => {
  const { restaurante_id } = req.params;
  const result = await pool.query(
    'SELECT * FROM restauranteGaleria WHERE restaurante_id = $1',
    [restaurante_id]
  );
  res.json(result.rows);
});

app.post('/restauranteGaleria', async (req, res) => {
  const { restaurante_id, imagenUrl } = req.body;
  const result = await pool.query(
    'INSERT INTO restauranteGaleria (restaurante_id, imagenUrl) VALUES ($1, $2) RETURNING *',
    [restaurante_id, imagenUrl]
  );
  res.status(201).json(result.rows[0]);
});

app.delete('/restauranteGaleria', async (req, res) => {
  const { restaurante_id, imagenUrl } = req.body;
  const result = await pool.query(
    'DELETE FROM restauranteGaleria WHERE restaurante_id = $1 AND imagenUrl = $2 RETURNING *',
    [restaurante_id, imagenUrl]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Imagen no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS COMENTARIO
// Obtener todos los comentarios
app.get('/comentarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM comentario');
  res.json(result.rows);
});

// Obtener comentarios de un restaurante
app.get('/comentarios/restaurante/:restaurante_id', async (req, res) => {
  const { restaurante_id } = req.params;
  const result = await pool.query(
    'SELECT * FROM comentario WHERE restaurante_id = $1',
    [restaurante_id]
  );
  res.json(result.rows);
});

// Crear comentario (único por usuario+restaurante)
app.post('/comentarios', async (req, res) => {
  const { usuario_id, restaurante_id, comentario, calificacion } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO comentario (usuario_id, restaurante_id, comentario, calificacion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [usuario_id, restaurante_id, comentario, calificacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).send({
        message: 'El usuario ya tiene un comentario para este restaurante'
      });
    }
    throw err;
  }
});

// Actualizar comentario
app.put('/comentarios/:id', async (req, res) => {
  const { id } = req.params;
  const { comentario, calificacion } = req.body;
  const result = await pool.query(
    `UPDATE comentario 
     SET comentario = $1, calificacion = $2
     WHERE id = $3
     RETURNING *`,
    [comentario, calificacion, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Comentario no encontrado' });
  }
  res.json(result.rows[0]);
});

// Eliminar comentario
app.delete('/comentarios/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'DELETE FROM comentario WHERE id = $1 RETURNING *',
    [id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Comentario no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ==================================== ENDPOINTS REACT JS ====================================

// ----------------------------------------- ENDPOINTS TIPO USUARIO - ESTADO = OK
// Obtener todos los tipos de usuario
app.get('/tipousuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM tipousuario');
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tabla Tipo de usuario vacia' });
  }
  res.json(result.rows);
});
// Obtener un tipo de usuario por id
app.get('/tipousuarios/:id', async (req, res) => {
  const {id} = req.params;
  const result = await pool.query('SELECT * FROM tipousuario WHERE id = $1',[id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tipo de usuario no encontrado' });
  }
  res.json(result.rows);
});
// Crear nuevo tipo de usuario
app.post('/tipousuarios', async (req, res) => {
  const { name, active } = req.body;
  const result = await pool.query(
    'INSERT INTO tipousuario (name, active) VALUES ($1, $2) RETURNING *',
    [name, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar tipo de usuario
app.put('/tipousuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  const result = await pool.query(
    'UPDATE tipousuario SET name = $1, active = $2 WHERE id = $3 RETURNING *',
    [name, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tipo de usuario no encontrado' });
  }
  res.json(result.rows[0]);
});
// Eliminar tipo de usuario
app.delete('/tipousuarios/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM tipousuario WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tipo de usuario no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS USUARIOS - ESTADO = OK

// Autenticación de usuario
app.post('/web/auth/login', async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const query = ` SELECT * FROM usuario WHERE correo = $1 AND clave = $2; `;
    const result = await pool.query(query,[correo, clave]);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Tipo de usuario no encontrado' });
    }
    const usuario = result.rows[0];

    if (!usuario.active) {
      return res.status(403).json({ message: 'Tu cuenta esta desactivada. Contactese con soporte.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id,
        correo: usuario.correo,
        tipousuario_id : usuario.tipousuario_id  
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    // Devolver token + datos del usuario (SIN contraseña)
    res.json({
      token,
      usuario: {
        id: usuario.id,
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        fecha_nac: usuario.fecha_nac,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        region_id: usuario.region_id,
        comuna_id: usuario.comuna_id,
        tipousuario_id : usuario.tipousuario_id,
        active: usuario.active
      }
    });
  }catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  const query = `
    SELECT u.*, t.name AS tipo_usuario_nombre, r.name AS region_nombre, c.name AS comuna_nombre 
    FROM usuario u
    JOIN tipousuario t ON u.tipoUsuario_id = t.id
    JOIN region r ON u.region_id = r.id
    JOIN comuna c ON u.comuna_id = c.id;
  `;
  const result = await pool.query(query);
  res.json(result.rows);
});
// Obtener un usuario por rut
app.get('/usuarios/rut/:rut', async (req, res) => {
  const {rut} = req.params;
  const result = await pool.query('SELECT * FROM usuario WHERE rut = $1', [rut]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Usuario no encontrado' });
  }
  res.json(result.rows);
});
// Obtener un usuario por id
app.get('/usuarios/:id', async (req, res) => {
  const {id} = req.params;
  const result = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Usuario no encontrado' });
  }
  res.json(result.rows);
});
// Obtener un usuario por correo
app.get('/usuarios/email/:correo', async (req, res) => {
  const {correo} = req.params;
  const result = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Usuario no encontrado' });
  }
  res.json(result.rows);
});
// Crear nuevo usuario
/* app.post('/usuarios', async (req, res) => {
  const { rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active } = req.body;
  const result = await pool.query(
    `INSERT INTO usuario (rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active]
  );
  res.status(201).json(result.rows[0]);
}); */
app.post('/usuarios', async (req, res) => {
  const { rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active } = req.body;
  
  try {
    // 1. Crear el usuario
    const result = await pool.query(
      `INSERT INTO usuario (rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [rut, nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active]
    );
    
    const nuevoUsuario = result.rows[0];
    
    // 2. Generar token JWT para login automático
    const token = jwt.sign(
      { 
        id: nuevoUsuario.id,
        correo: nuevoUsuario.correo,
        tipousuario_id: nuevoUsuario.tipousuario_id  
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    // 3. Devolver usuario + token (igual que /auth/login)
    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario.id,
        rut: nuevoUsuario.rut,
        nombre: nuevoUsuario.nombre,
        apellidos: nuevoUsuario.apellidos,
        correo: nuevoUsuario.correo,
        fecha_nac: nuevoUsuario.fecha_nac,
        telefono: nuevoUsuario.telefono,
        direccion: nuevoUsuario.direccion,
        region_id: nuevoUsuario.region_id,
        comuna_id: nuevoUsuario.comuna_id,
        tipousuario_id: nuevoUsuario.tipousuario_id,
        active: nuevoUsuario.active
      }
    });
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});
// Actualizar usuario existente
app.put('/usuarios/:rut', async (req, res) => {
  const { rut } = req.params;
  const { nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active } = req.body;
  const result = await pool.query(
    `UPDATE usuario SET nombre = $1, apellidos = $2, correo = $3, clave = $4, fecha_nac = $5, telefono = $6, direccion = $7, region_id = $8, 
     comuna_id = $9, tipoUsuario_id = $10,  active = $11
     WHERE rut = $12 RETURNING *`,
    [nombre, apellidos, correo, clave, fecha_nac, telefono, direccion, region_id, comuna_id, tipoUsuario_id, active, rut]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Usuario no encontrado para actualizar' });
  }
  res.json(result.rows[0]);
});
// Eliminar usuario
app.delete('/usuarios/:rut', async (req, res) => {
  const { rut } = req.params;
  const result = await pool.query('DELETE FROM usuario WHERE rut = $1 RETURNING *', [rut]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Usuario no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS CATEGORIAS - ESTADO = OK
// Obtener todas las categorías
app.get('/categorias', async (req, res) => {
  const result = await pool.query('SELECT * FROM categoria');
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Tabla Categoría vacia' });
  }
  res.json(result.rows);
});
// Obtener una categoría por ID
app.get('/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM categoria WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Categoría no encontrada' });
  }
  res.json(result.rows[0]);
});
// Crear una nueva categoría
app.post('/categorias', async (req, res) => {
  const { name, active } = req.body;
  const result = await pool.query(
    'INSERT INTO categoria (name, active) VALUES ($1, $2) RETURNING *',
    [name, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar una categoría existente
app.put('/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  const result = await pool.query(
    'UPDATE categoria SET name = $1, active = $2 WHERE id = $3 RETURNING *',
    [name, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Categoría no encontrada para actualizar' });
  }
  res.json(result.rows[0]);
});
// Eliminar una categoría
app.delete('/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM categoria WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Categoría no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS PRODUCTOS 
// Obtener todos los productos
app.get('/productos', async (req, res) => {
  const result = await pool.query('SELECT * FROM producto');
  res.json(result.rows);
});
// Obtener un producto por ID
app.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Producto no encontrado' });
  }
  res.json(result.rows[0]);
});
// Obtener un producto por categoria ID
app.get('/productos/relacionados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Primero buscamos el producto
    const prodResult = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);

    if (prodResult.rows.length === 0) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    // Guardamos su categoria
    const categoriaId = prodResult.rows[0].category_id;
    // Filtramos por el producto ademas de excluirlo y su categoria
    const categResult = await pool.query('SELECT * FROM producto WHERE category_id = $1 AND id != $2 LIMIT 5', [categoriaId,id]);
    
    res.json(categResult.rows);

  } catch (error) {
    console.error('Error al obtener productos relacionados:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
  
});
// Crear un nuevo producto
app.post('/productos', async (req, res) => {
  const { name, price, image, category_id, description, stock_actual, stock_critico, active } = req.body;
  const result = await pool.query(
    `INSERT INTO producto (name, price, image, category_id, description, stock_actual, stock_critico, active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, price, image, category_id, description, stock_actual, stock_critico, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar un producto existente
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image, category_id, description, stock_actual, stock_critico, active } = req.body;
  const result = await pool.query(
    `UPDATE producto SET name = $1, price = $2, image = $3, category_id = $4, description = $5, stock_actual = $6, stock_critico = $7, active = $8
     WHERE id = $9 RETURNING *`,
    [name, price, image, category_id, description, stock_actual, stock_critico, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Producto no encontrado para actualizar' });
  }
  res.json(result.rows[0]);
});
// Eliminar un producto ***** NO UTILIZAR *****
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM producto WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Producto no encontrado para eliminar' });
  }
  res.status(204).send(); // 204 No Content indica éxito sin cuerpo de respuesta
});
// ----------------------------------------- ENDPOINTS REGIONES - ESTADO = OK
// Obtener todas las regiones
app.get('/regiones', async (req, res) => {
  const result = await pool.query('SELECT * FROM region');
  res.json(result.rows);
});
// Obtener una region por id
app.get('/regiones/:id', async (req, res) => {
  const {id} = req.params;
  const result = await pool.query('SELECT * FROM region WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Región no encontrada' });
  }
  res.json(result.rows);
});
// Crear nueva región
app.post('/regiones', async (req, res) => {
  const { name, active } = req.body;
  const result = await pool.query(
    'INSERT INTO region (name, active) VALUES ($1, $2) RETURNING *',
    [name, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar región
app.put('/regiones/:id', async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  const result = await pool.query(
    'UPDATE region SET name = $1, active = $2 WHERE id = $3 RETURNING *',
    [name, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Región no encontrada' });
  }
  res.json(result.rows[0]);
});
// Eliminar región
app.delete('/regiones/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM region WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Región no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS COMUNAS - ESTADO = OK
// Obtener todas las comunas
app.get('/comunas', async (req, res) => {
  const query = `
    SELECT c.*, r.name AS nombre_region 
    FROM comuna c
    JOIN region r ON c.region_id = r.id;
  `;
  const result = await pool.query(query);
  res.json(result.rows);
});
// Obtener una comuna por id
app.get('/comunas/:id', async (req, res) => {
  const {id} = req.params;
  const query = `
    SELECT c.*, r.name AS nombre_region 
    FROM comuna c
    JOIN region r ON c.region_id = r.id WHERE c.id = $1;
  `;
  const result = await pool.query(query,[id]);
  res.json(result.rows);
});
// Crear nueva comuna
app.post('/comunas', async (req, res) => {
  const { name, region_id, active } = req.body;
  const result = await pool.query(
    'INSERT INTO comuna (name, region_id, active) VALUES ($1, $2, $3) RETURNING *',
    [name, region_id, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar comuna
app.put('/comunas/:id', async (req, res) => {
  const { id } = req.params;
  const { name, region_id, active } = req.body;
  const result = await pool.query(
    'UPDATE comuna SET name = $1, region_id = $2, active = $3 WHERE id = $4 RETURNING *',
    [name, region_id, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Comuna no encontrada' });
  }
  res.json(result.rows[0]);
});
// Eliminar comuna
app.delete('/comunas/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM comuna WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Comuna no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS METODOS DE PAGO - ESTADO = OK
// Obtener todas las metodos de pago
app.get('/metodosPago', async (req, res) => {
  const result = await pool.query('SELECT * FROM metodoPago');
  res.json(result.rows);
});
// Obtener un metodo de pago por id
app.get('/metodosPago/:id', async (req, res) => {
  const {id} = req.params;
  const result = await pool.query('SELECT * FROM metodoPago WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'MetodoPago no encontrada' });
  }
  res.json(result.rows);
});
// Crear nuevo metodos de pago
app.post('/metodosPago', async (req, res) => {
  const { name, active } = req.body;
  const result = await pool.query(
    'INSERT INTO metodoPago (name, active) VALUES ($1, $2) RETURNING *',
    [name, active]
  );
  res.status(201).json(result.rows[0]);
});
// Actualizar metodo de pago
app.put('/metodosPago/:id', async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  const result = await pool.query(
    'UPDATE metodoPago SET name = $1, active = $2 WHERE id = $3 RETURNING *',
    [name, active, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'MetodoPago no encontrada' });
  }
  res.json(result.rows[0]);
});
// Eliminar metodo de pago
app.delete('/metodosPago/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM metodoPago WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'MetodoPago no encontrada para eliminar' });
  }
  res.status(204).send();
});

// ----------------------------------------- ENDPOINTS CARRITO - ESTADO = OK
// LISTAR
app.get('/carritos', async (req, res) => {
  const result = await pool.query('SELECT * FROM carrito');
  res.json(result.rows);
});
// BUSCAR
app.get('/carritos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM carrito WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Carrito no encontrado' });
  }
  res.json(result.rows[0]);
});
// CREAR
app.post('/carritos', async (req, res) => {
  const { usuario_id, estado } = req.body;
  const result = await pool.query(
    'INSERT INTO carrito (usuario_id, estado) VALUES ($1, $2) RETURNING *',
    [usuario_id, estado]
  );
  res.status(201).json(result.rows[0]);
});
// ACTUALIZAR
app.put('/carritos/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario_id, estado } = req.body;

  const result = await pool.query(
    'UPDATE carrito SET usuario_id = $1, estado = $2 WHERE id = $3 RETURNING *',
    [usuario_id, estado, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Carrito no encontrado' });
  }
  res.json(result.rows[0]);
});
// ELIMINAR
app.delete('/carritos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM carrito WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Carrito no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS CARRITO DETALLE
// LISTAR
app.get('/carritoDetalle', async (req, res) => {
  const result = await pool.query('SELECT * FROM carritoDetalle');
  res.json(result.rows);
});
// BUSCAR
app.get('/carritoDetalle/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM carritoDetalle WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado' });
  }
  res.json(result.rows[0]);
});
// CREAR
app.post('/carritoDetalle', async (req, res) => {
  const { carrito_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;

  const result = await pool.query(
    'INSERT INTO carritoDetalle (carrito_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [carrito_id, producto_id, cantidad, precio_unitario, subtotal]
  );

  res.status(201).json(result.rows[0]);
});
// ACTUALIZAR
app.put('/carritoDetalle/:id', async (req, res) => {
  const { id } = req.params;
  const { carrito_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;

  const result = await pool.query(
    'UPDATE carritoDetalle SET carrito_id = $1, producto_id = $2, cantidad = $3, precio_unitario = $4, subtotal = $5 WHERE id = $6 RETURNING *',
    [carrito_id, producto_id, cantidad, precio_unitario, subtotal, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado' });
  }
  res.json(result.rows[0]);
});
// ELIMINAR
app.delete('/carritoDetalle/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM carritoDetalle WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS BOLETA
// LISTAR
app.get('/boletas', async (req, res) => {
  const result = await pool.query('SELECT * FROM boleta');
  res.json(result.rows);
});
// BUSCAR
app.get('/boletas/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM boleta WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Boleta no encontrada' });
  }
  res.json(result.rows[0]);
});
// CREAR
app.post('/boletas', async (req, res) => {
  const { numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado } = req.body;

  const result = await pool.query(
    'INSERT INTO boleta (numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado]
  );

  res.status(201).json(result.rows[0]);
});
// ACTUALIZAR
app.put('/boletas/:id', async (req, res) => {
  const { id } = req.params;
  const { numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado } = req.body;

  const result = await pool.query(
    'UPDATE boleta SET numero_boleta = $1, usuario_id = $2, carrito_id = $3, metodoPago_id = $4, subtotal = $5, iva = $6, total = $7, direccion_envio = $8, estado = $9 WHERE id = $10 RETURNING *',
    [numero_boleta, usuario_id, carrito_id, metodoPago_id, subtotal, iva, total, direccion_envio, estado, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Boleta no encontrada' });
  }

  res.json(result.rows[0]);
});
// ELIMINAR
app.delete('/boletas/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM boleta WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Boleta no encontrada para eliminar' });
  }
  res.status(204).send();
});
// ----------------------------------------- ENDPOINTS BOLETA DETALLE
// LISTAR
app.get('/boletaDetalle', async (req, res) => {
  const result = await pool.query('SELECT * FROM boletaDetalle');
  res.json(result.rows);
});
// BUSCAR
app.get('/boletaDetalle/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM boletaDetalle WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado' });
  }
  res.json(result.rows[0]);
});
// BUSCAR boleta_id
app.get('/boletaDetalle/boleta/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM boletaDetalle WHERE boleta_id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado' });
  }
  res.json(result.rows[0]);
});
// CREAR
app.post('/boletaDetalle', async (req, res) => {
  const { boleta_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;

  const result = await pool.query(
    'INSERT INTO boletaDetalle (boleta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [boleta_id, producto_id, cantidad, precio_unitario, subtotal]
  );

  res.status(201).json(result.rows[0]);
});
// ACTUALIZAR
app.put('/boletaDetalle/:id', async (req, res) => {
  const { id } = req.params;
  const { boleta_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;

  const result = await pool.query(
    'UPDATE boletaDetalle SET boleta_id = $1, producto_id = $2, cantidad = $3, precio_unitario = $4, subtotal = $5 WHERE id = $6 RETURNING *',
    [boleta_id, producto_id, cantidad, precio_unitario, subtotal, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado' });
  }

  res.json(result.rows[0]);
});
// ELIMINAR
app.delete('/boletaDetalle/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM boletaDetalle WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send({ message: 'Detalle no encontrado para eliminar' });
  }

  res.status(204).send();
});
// ----------------------------------------- INICIAR SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Acceder a los productos en:
//  http://[TU-IP-EC2]:3000/productos