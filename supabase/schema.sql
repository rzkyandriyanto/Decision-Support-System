CREATE TABLE students (
    nim TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    ipk FLOAT NOT NULL,
    sks_total INT NOT NULL,
    count_c INT NOT NULL,
    count_d INT NOT NULL,
    count_e INT NOT NULL,
    pm_status TEXT CHECK (pm_status IN ('On-Track', 'Early Warning')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create an index on class_name for faster filtering
CREATE INDEX idx_students_class_name ON students(class_name);
