Bibani Select Luxury Shopping App V3

1. ZIP entpacken. ALLE Dateien aus dem entpackten Ordner im bestehenden GitHub-Repository bibani-select-shop hochladen; vorhandene Dateien ersetzen. Nicht die ZIP selbst hochladen.
2. GitHub Pages Deployment abwarten und Browser neu laden.
3. Shopify-Produktabruf erfolgt aktuell ueber /products.json (oeffentlicher Shopify-Endpunkt). Dies ist KEINE verifizierte Storefront-API-Anbindung. CORS, Sichtbarkeit, Varianten, Checkout und reale Bestellungen muessen getestet werden.
4. Kategorien Armbänder und Ohrringe sind separat. Automatische Kategorieerkennung erfolgt anhand Produktnamen, Produkttyp und Tags. Fuer korrekte Zuordnung eindeutige Shopify-Produkttitel/Typen verwenden.
5. Der Warenkorb ist lokal im Browser; beim Checkout wird ein Shopify Cart Permalink erzeugt.
6. GitHub Pages HTTPS-Zertifikat muss funktionieren, bevor die App fuer Kunden genutzt wird.

V4: bebilderte Kategorien aus echten Shopify-Produktfotos, visuelles Titelbild, Neuheiten-Karten, Cache-Version v4. Shopify-Produkte werden ueber /products.json abgerufen; Shopify Storefront API ist noch nicht konfiguriert. Bitte Checkout und Kategorisierung vor Kundenfreigabe testen. HTTPS ist zwingend erforderlich.
