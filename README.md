 # Event Hub

## Tech Stack

**Frontend**  
- Next.js  
- Redux  
- React Hook Form  
- Pagination  
- React-toastify

**Backend**  
- JWT (JSON Web Token) for authentication  
- PostgreSQL  

**Prerequisite**  
- Ensure **Docker** is installed on your system

---

## Techniques Used

1. Use of **database transactions** for reliable data operations  
2. **LIMIT** and **OFFSET** for reduce loads on db  
3. Use of **INDEX** for columns for search query.    
4. **React Hook Form** for input validation  
5. **Redux** for consistent state management throughout the app  
6. **Pagination** to reduce network load  
7. Use of **Enums** for data consistency  
8. **JWT** for token-based login and secure routes  
9. **Docker** for simplified application setup and containerization  
9. **MomentJs** for Date related Tasks.  

---

**Admin login**  
- UserEmail: admin@gmail.com
- password: admin

---




## Getting Started

Open a terminal at the root of the project and run the following commands:

1. Start the database with Docker:
   ```bash
   docker-compose up  (wait atlest 1 min)

2. Seed the data:
   ```bash
   npm run seed

3. Start the Application:
   ```bash
   npm run dev

4. Connect the pg admin on port localhost:5050 


  - Credentials : admin@admin.com
  - Passord     : admin
