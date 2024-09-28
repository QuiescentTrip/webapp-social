# Sosial media Webapp

Vår eksamen i webapp der vi skal lage en nettside som brukeren kan opplaste bilder og kommentere på andres bilder.

## Known bugs

- Console errors. The backend tries to reauthorize the user on refresh. For some reason.

## How to run

First you have to migrate the database.

```bash
dotnet ef migrations add DBinit
dotnet ef database update
```

Then you can run the frontend and backend.

**If you have gum installed you can use the `run.sh` script.**

If not:

- Først clone
- Front end kjøres med `(cd .\frontend\) npm run dev`
- Backend kjøres med `(cd .\SocialMediaApi\) dotnet watch run` - tilgang til swagger
- Må ha sql serveren oppe.

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
- [ ] **ROLES**! Viktig, admin role for delete.
- [ ] Faen må vi ha edit også?

### Todos extras:

- [ ] Profile

## Ressurser:

- ~~[Innstallere tailwind med aspnet](https://github.com/angeldev96/tailwind-aspdotnet/tree/master)~~ Bruker ikke aspnet til frontend
- [chadcn components](https://ui.shadcn.com/docs/components/accordion)
- [Likt prosjekt](https://github.com/teddysmithdev/FinShark)
- [Likt prosjekt, men noen år gammel med dotnet 6?](https://github.com/CodAffection/React-CRUD-with-Asp.Net-Core-Web-API)
