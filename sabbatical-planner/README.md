# Sabbatical reisplanner

Eén los HTML-bestand om een reis van ~2 maanden te plannen op stops en aantal dagen.

## Gebruiken

Open `index.html` in je browser (dubbelklikken is genoeg — geen server, geen installatie).

- **Vertrekdatum** bovenaan bepaalt waar de reis begint.
- **Stops** voeg je toe met "+ Stop toevoegen". Per stop vul je een naam en het aantal **nachten** in
  (met − / + of door het getal te typen). Alle aankomst- en vertrekdatums schuiven automatisch mee.
- **Vaste datums**: onder elke stop staat "📌 datum vastzetten". Die stop blijft daarna op zijn datum
  staan, wat je ervoor ook verandert. Je kiest zelf of de **aankomst** of het **vertrek** vastligt:
  met "vertrek" telt de planner terug vanaf die datum, zodat je "de laatste 10 nachten vóór de boot"
  gewoon kunt invullen — het gat ervóór krimpt dan mee. Zo staan het begin (20 aug) en de terugreis
  (boot 5 okt, Lyon 9 okt, laatste rijdag 13 okt) al vast.
- **Nog te plannen**: de gestreepte blokken tussen twee vaste stops zijn de dagen die nog vrij zijn.
  Met "+ stop hier" plaats je daar een nieuwe stop; het gat krimpt automatisch mee. Plan je te veel
  nachten, dan verschijnt een waarschuwing bij de vaste stop die je overloopt.
- **Kleur** per stop kies je via het gekleurde balkje links.
- **Volgorde** wijzig je door een stop te verslepen (sleepgreep ⠿ rechts).
- De **kalender** heeft twee weergaven, om te wisselen met de knoppen rechtsboven:
  **Overzicht** (alle maanden naast elkaar, kleine vakjes) en **Per maand** (één maand groot,
  met in elk dagvak de naam van de stop en of het een aankomst of laatste nacht is; blader met ‹ ›).
  De gekozen weergave wordt onthouden.
- Het overzicht toont alle maanden van de reis; elke dag krijgt de kleur van de stop
  waar je dan bent, met de naam op de eerste dag. Gestreepte dagen zijn nog niet ingevuld.

## Het beginplan

Bij "Terug naar beginplan" (en bij een lege browser) staat de reis van 2026 klaar:
Karlsruhe 2 n · Como 1 n · Camping Pian d'Amora 7 n · Florence 4 n · **32 nachten te plannen** ·
boot Palermo–Genua 5 okt · **3 nachten te plannen** · Lyon 9–13 okt · laatste rijdag 13 okt ·
thuis 14 oktober.

Zolang de reis loopt staat boven de totalen welke dag je vandaag zit, waar je bent en hoeveel
nachten er nog te gaan zijn; de dag van vandaag krijgt in de kalender een zwart randje.

- **Ideeën**: onder de stops staat een verlanglijst van bestemmingen die je nog wilt inplannen.
  Typ een naam en zet het aantal nachten. Met het keuzelijstje eronder **wijs je een idee toe aan
  een open blok** — het blijft dan nog een idee, maar telt wel mee. De lijst is per blok gegroepeerd
  met een teller: "18 / 32 n · 14 over", of rood "6 te veel" als je eroverheen gaat. Dezelfde stand
  staat ook in het gestreepte blok tussen de stops.
  Klopt de verdeling, klik dan **"zet in het plan"** bij dat blok: alle ideeën eronder worden in die
  volgorde stops op die plek, en verdwijnen van de lijst.

## Bewaren

De gepubliceerde webversie (`artifact.html`) legt het plan **in de pagina zelf** vast: met de knop
"Opslaan" publiceert de pagina een nieuwe versie van zichzelf met jouw plan erin, en dat vangnet
gaat na een halve minuut zonder klikken vanzelf af. Daardoor staat het plan er ook als je de pagina
op een ander apparaat opent. De statusregel naast de knop zegt wanneer het is vastgelegd, of
waarschuwt als deze weergave niet mag publiceren.

Het losse `index.html` hieronder werkt anders:

het plan wordt in je browser bewaard (localStorage), dus het staat er nog als je het tabblad sluit. Voor een back-up of om het plan op een andere computer te openen:

- **Opslaan als bestand** → downloadt `sabbatical-plan.json`
- **Openen** → laadt zo'n bestand weer in
- **Printen** → printvriendelijke weergave van de kalender

Let op: localStorage is per browser en per apparaat. Wissen van je browserdata wist ook het plan —
maak dus af en toe een back-upbestand.
