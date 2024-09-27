# Sosial media Webapp
Vår eksamen i webapp der vi skal lage en nettside som brukeren kan opplaste bilder og kommentere på andres bilder.

## Known bugs

- ~~Register kan gi feil, men dette er fordi backend ikke gir full output for feil.~~
- ~~Du kan bare logge inn med brukeren du har opprettet om usernavnet ditt er det samme som emailen din. (Takk PasswordSignInAsync)~~
- ~~Navbar rerender ikke på signin.~~

## How to run

**If you have gum installed you can use the `run.sh` script.**

If not:
- Først clone
- Front end kjøres med `(cd .\frontend\) npm run dev`
- Backend kjøres med `(cd .\SocialMediaApi\) dotnet watch run` - tilgang til swagger
- Må ha sql serveren oppe.



## MVP todo:
- [x] Create homepage
  - [ ] Integrer homepage med backend   
- [x] Register
- [x] Login
- [ ] Create post
- [ ] Fileupload # Kan gjøres med uploadthing
- [ ] Comment

### Todos extras:
- [ ] Profile

## Ressurser:
- ~~[Innstallere tailwind med aspnet](https://github.com/angeldev96/tailwind-aspdotnet/tree/master)~~ Bruker ikke aspnet til frontend
- [chadcn components](https://ui.shadcn.com/docs/components/accordion)
- [Likt prosjekt](https://github.com/teddysmithdev/FinShark)
- [Likt prosjekt, men noen år gammel med dotnet 6?](https://github.com/CodAffection/React-CRUD-with-Asp.Net-Core-Web-API)
