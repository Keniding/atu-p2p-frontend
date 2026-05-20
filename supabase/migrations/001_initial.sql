CREATE TABLE bus_locations (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id    TEXT NOT NULL,
  bus_line_id  TEXT NOT NULL,
  latitude     DOUBLE PRECISION NOT NULL,
  longitude    DOUBLE PRECISION NOT NULL,
  speed_kmh    REAL NOT NULL DEFAULT 0,
  direction_degrees REAL NOT NULL DEFAULT 0,
  is_driver    BOOLEAN NOT NULL DEFAULT false,
  platform     TEXT NOT NULL DEFAULT 'android',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bus_lines (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  color    TEXT NOT NULL DEFAULT '#2563EB',
  stops    JSONB,
  polyline JSONB,
  active   BOOLEAN DEFAULT true
);

ALTER PUBLICATION supabase_realtime ADD TABLE bus_locations;

CREATE INDEX idx_bus_locations_line    ON bus_locations(bus_line_id);
CREATE INDEX idx_bus_locations_updated ON bus_locations(updated_at DESC);

CREATE OR REPLACE FUNCTION cleanup_old_locations()
RETURNS void AS $$
BEGIN
  DELETE FROM bus_locations
  WHERE updated_at < NOW() - INTERVAL '30 seconds';
END;
$$ LANGUAGE plpgsql;

INSERT INTO bus_lines (id, name, color) VALUES
  ('corredor-azul',     'Corredor Azul',     '#2563EB'),
  ('corredor-rojo',     'Corredor Rojo',     '#DC2626'),
  ('corredor-morado',   'Corredor Morado',   '#7C3AED'),
  ('corredor-amarillo', 'Corredor Amarillo', '#D97706'),
  ('corredor-verde',    'Corredor Verde',    '#16A34A'),
  ('metropolitano',     'Metropolitano',     '#0891B2'),
  ('metro-linea1',      'Metro Linea 1',     '#BE185D'),
  ('metro-linea2',      'Metro Linea 2',     '#B45309');
