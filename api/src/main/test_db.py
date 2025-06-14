from .database import drop_tables

def test_db():
    drop_tables()
    print("Tables dropped successfully!")

if __name__ == "__main__":
    test_db()
