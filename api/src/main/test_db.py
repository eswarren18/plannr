from .database import create_tables

def test_db():
    create_tables()
    print("Tables created successfully!")

if __name__ == "__main__":
    test_db()
