# Sabbatical reisplanner

Eén los HTML-bestand om een reis van ~2 maanden te plannen op stops en aantal dagen.

## Gebruiken

Open `index.html` in je browser (dubbelklikken is genoeg — geen server, geen installatie).

- **Vertrekdatum** bovenaan bepaalt waar de reis begint.
- **Stops** voeg je toe met "+ Stop toevoegen". Per stop vul je een naam en het aantal dagen in
  (met − / + of door het getal te typen). Alle aankomst- en vertrekdatums schuiven automatisch mee.
- **Kleur** per stop kies je via het gekleurde balkje links.
- **Volgorde** wijzig je door een stop te verslepen (sleepgreep ⠿ rechts).
- De **kalender** rechts toont alle maanden van de reis; elke dag krijgt de kleur van de stop
  waar je dan bent, met de naam op de eerste dag.

## Bewaren

Het plan wordt automatisch in je browser bewaard (localStorage), dus het staat er nog als je
het tabblad sluit. Voor een back-up of om het plan op een andere computer te openen:

- **Opslaan als bestand** → downloadt `sabbatical-plan.json`
- **Openen** → laadt zo'n bestand weer in
- **Printen** → printvriendelijke weergave van de kalender

Let op: localStorage is per browser en per apparaat. Wissen van je browserdata wist ook het plan —
maak dus af en toe een back-upbestand.
