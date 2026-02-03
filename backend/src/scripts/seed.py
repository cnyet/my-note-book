from src.core.database import SessionLocal
from src.models.agent import Agent
from src.models.category import Category
from src.models.tag import Tag


def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Categories
        categories = ["AI Agents", "Developer Tools", "AI Research", "Tutorials"]
        cat_objs = []
        for cat_name in categories:
            cat = db.query(Category).filter(Category.name == cat_name).first()
            if not cat:
                cat = Category(name=cat_name, description=f"{cat_name} category")
                db.add(cat)
                cat_objs.append(cat)

        db.commit()
        print(f"✅ Seeded {len(cat_objs)} categories")

        # 2. Seed Agents
        # Matching fields: name, description, category, tags, rating, is_featured, is_premium, creator
        agents_data = [
            {
                "name": "Prometheus",
                "description": "The Planner - Responsible for high-level planning and task decomposition.",
                "category": "AI Agents",
                "tags": "Planning, Strategy",
                "rating": 4.9,
                "is_featured": True,
                "is_premium": False,
                "creator": "work-agents team",
            },
            {
                "name": "Sisyphus",
                "description": "The Implementer - Responsible for code generation and technical execution.",
                "category": "AI Agents",
                "tags": "Coding, Execution",
                "rating": 4.8,
                "is_featured": True,
                "is_premium": False,
                "creator": "work-agents team",
            },
            {
                "name": "Hephaestus",
                "description": "The Architect - Responsible for system design and backend logic.",
                "category": "AI Agents",
                "tags": "Architecture, Backend",
                "rating": 4.9,
                "is_featured": False,
                "is_premium": True,
                "creator": "work-agents team",
            },
            {
                "name": "Frontend Eng",
                "description": "The UI/UX Specialist - Responsible for styling and user interaction.",
                "category": "AI Agents",
                "tags": "Frontend, UI/UX",
                "rating": 4.7,
                "is_featured": False,
                "is_premium": False,
                "creator": "work-agents team",
            },
            {
                "name": "Librarian",
                "description": "The Context Guardian - Responsible for documentation and knowledge retrieval.",
                "category": "AI Agents",
                "tags": "Documentation, Search",
                "rating": 4.6,
                "is_featured": False,
                "is_premium": False,
                "creator": "work-agents team",
            },
        ]

        agent_objs = []
        for a_data in agents_data:
            agent = db.query(Agent).filter(Agent.name == a_data["name"]).first()
            if not agent:
                agent = Agent(**a_data)
                db.add(agent)
                agent_objs.append(agent)

        db.commit()
        print(f"✅ Seeded {len(agent_objs)} agents")

        # 3. Seed Tags
        tags = ["Next.js", "FastAPI", "AI", "Automation", "OpenSpec"]
        tag_objs = []
        for t_name in tags:
            tag = db.query(Tag).filter(Tag.name == t_name).first()
            if not tag:
                tag = Tag(name=t_name)
                db.add(tag)
                tag_objs.append(tag)

        db.commit()
        print(f"✅ Seeded {len(tag_objs)} tags")

    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
