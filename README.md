# Sosial media Webapp

Vår eksamen i webapp der vi skal lage en nettside som brukeren kan opplaste bilder og kommentere på andres bilder.

## Known bugs

- Console errors. The backend tries to reauthorize the user on refresh. For some reason.

## How to run

**If on linux or mac:**

1. Install `gum`
2. Run `run.sh`

**For windows:**

1. Migrate the database

```bash
cd .\SocialMediaApi\
dotnet ef migrations add DBinit
dotnet ef database update
```

2. install and run on frontend

```powershell
cd .\frontend\; npm install; npm run dev
```

3. Run the backend

```bash
cd .\SocialMediaApi\; dotnet watch run
```

4. `localhost:3000` for frontend

## MVP todo:

- [x] Create homepage
  - [x] Integrer homepage med backend
- [x] Register
- [x] Login
- [x] Create post
- [x] Fileupload. ~~Kan gjøres med uploadthing~~ data streames til wwwroot der det blir lagret
- [x] Comment
- [x] Updated likes
- [x] All comments popup
- [x] Auto reload on comment
- [ ] Delete post
- [ ] Edit post
- [ ] Admin role

### Todos extras:

- [ ] Profile
- [ ] Profile picture

## Ressurser:

- ~~[Innstallere tailwind med aspnet](https://github.com/angeldev96/tailwind-aspdotnet/tree/master)~~ Bruker ikke aspnet til frontend
- [chadcn components](https://ui.shadcn.com/docs/components/accordion)
- [Likt prosjekt](https://github.com/teddysmithdev/FinShark)
- [Likt prosjekt, men noen år gammel med dotnet 6?](https://github.com/CodAffection/React-CRUD-with-Asp.Net-Core-Web-API)
