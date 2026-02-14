const API_ENDPOINT = "/api/sitemaps";
const API_FETCH_SITEMAP_ENDPOINT = "/api/fetch-sitemap";
const API_EMAIL_SEND_ENDPOINT = "/api/email/send";
const API_BREVO_SETTINGS_ENDPOINT = "/api/settings/brevo";
const API_BREVO_SETTINGS_TEST_ENDPOINT = "/api/settings/brevo/test";
const API_DISCOVER_SITEMAPS_ENDPOINT = "/api/sitemaps/discover";
const API_FETCH_PAGE_ENDPOINT = "/api/fetch-page";
const API_LINK_STATUS_ENDPOINT = "/api/links/status";
const API_LINK_MAP_LATEST_ENDPOINT = "/api/link-map/latest";
const API_LINK_MAP_EXPORT_ENDPOINT = "/api/link-map/export";
const API_LINK_MAP_JOBS_ENDPOINT = "/api/link-map/jobs";
const API_SCAN_START_ENDPOINT = "/api/scans/start";
const API_SCAN_PROGRESS_ENDPOINT = "/api/scans/progress";
const API_SCAN_COMPLETE_ENDPOINT = "/api/scans/complete";
const API_SCAN_LATEST_ENDPOINT = "/api/scans/latest";
const API_SCAN_LAST_ENDPOINT = "/api/scans/last";
const API_SCAN_NOTIFICATIONS_ENDPOINT = "/api/scans/notifications";
const API_SCAN_NOTIFICATIONS_READ_ALL_ENDPOINT = "/api/scans/notifications/read-all";
const CLIENT_FETCH_TIMEOUT_MS = 35000;
const METADATA_CONCURRENCY_LIMIT = 5;
const SCAN_PROGRESS_FLUSH_MS = 4000;
const SCAN_PROGRESS_BATCH = 25;
const HEADING_LINK_STATUS_MAX_URLS = 50;
const MAX_HEADING_LINKS_PER_SECTION = 20;
const HEADING_LINK_STATUS_TIMEOUT_MS = 12000;
const UI_INPUT_DEBOUNCE_MS = 250;
const NOTIFICATION_CENTER_POLL_MS = 15000;
const CONTENT_PARAGRAPH_MIN_LENGTH = 30;
const COMPARE_CONTENT_DIFF_PREVIEW_LIMIT = 12;
const COMPARE_MIN_ITEMS = 2;
const COMPARE_MAX_ITEMS = 4;

const LANGUAGE_STORAGE_KEY = "sitemapflow:language";
const SUPPORTED_LANGUAGES = ["en", "tr"];
const DEFAULT_LANGUAGE = "en";

const I18N_STRINGS = {
  en: {
    "menu.open": "Open menu",
    "menu.close": "Hide menu",
    "sidebar.aria": "Main navigation",
    "status.online": "Online",
    "nav.dashboard": "Dashboard",
    "nav.reports": "Reports (coming soon)",
    "nav.settings": "Settings",
    "nav.logout": "Sign Out",
    "nav.menu": "Main menu",
    "controls.filter": "Filter",
    "controls.searchPlaceholder": "Search by URL or title",
    "controls.refresh": "Refresh",
    "controls.refreshLoading": "Loading...",
    "controls.notifications.enable": "Enable Notifications",
    "controls.notifications.disable": "Disable Notifications",
    "controls.notifications.label": "Notifications",
    "controls.exportCsv": "Export CSV",
    "controls.exportJson": "Export JSON",
    "controls.alertsOnly": "Show alerts only",
    "controls.export.noData": "Nothing to export yet.",
    "controls.export.success": "Export started.",
    "controls.export.error": "Export failed, please try again.",
    "notifications.enabled": "Notifications enabled. We'll let you know when sitemaps change.",
    "notifications.disabled": "Notifications disabled.",
    "domain.label": "Domain",
    "domain.filters": "Domain filters",
    "filters.all": "All",
    "tags.label": "Tag",
    "tags.filters": "Tag filters",
    "tags.empty": "No tags",
    "tags.addTitle": "Add Tag",
    "tags.addPlaceholder": "Tag",
    "tags.addEmpty": "Add a new tag",
    "tags.removeAria": "Remove {tag} tag",
    "adder.title": "Add Sitemap",
    "adder.field.title": "Title",
    "adder.field.titlePlaceholder": "Example: Blog Sitemap",
    "adder.field.url": "URL",
    "adder.field.urlPlaceholder": "https://site.com/sitemap.xml",
    "adder.submit": "Add",
    "adder.feedTitle": "Add RSS Feed",
    "adder.feedDescription": "Track RSS/Atom feeds without mixing them with XML sitemaps.",
    "adder.feed.urlPlaceholder": "https://site.com/rss.xml",
    "adder.feed.submit": "Add Feed",
    "adder.tabs.aria": "Sitemap tools",
    "adder.tab.discover": "Discover",
    "adder.tab.addSitemap": "Add Sitemap",
    "adder.tab.addRss": "Add RSS",
    "finder.title": "Discover Sitemaps",
    "finder.description": "Scan a domain to detect sitemap or feed URLs automatically.",
    "finder.field.domain": "Domain or URL",
    "finder.field.placeholder": "example.com",
    "finder.submit": "Scan",
    "finder.submitLoading": "Scanning...",
    "finder.status.idle": "Enter a domain to start searching.",
    "finder.status.loading": "Scanning {domain}...",
    "finder.status.success": "{count} candidates found for {domain}.",
    "finder.status.empty": "No sitemap-like URLs were detected for {domain}.",
    "finder.status.error": "Discovery failed: {error}",
    "finder.empty": "No discovery results yet.",
    "finder.results.source.dom": "HTML",
    "finder.results.source.robots": "Robots.txt",
    "finder.results.source.guess": "Common path",
    "finder.results.source.child": "Sitemap index",
    "finder.results.added": "Already added",
    "finder.results.status.valid": "Verified",
    "finder.results.status.invalid": "Not reachable",
    "finder.results.status.code": "HTTP {status}",
    "finder.results.reason.html": "HTML page",
    "finder.results.reason.invalidXml": "Invalid XML",
    "finder.parentLabel": "Found in {parent}",
    "finder.countLabel": "{count} URLs",
    "finder.addSingle": "Add",
    "finder.addSelected": "Add Selected",
    "finder.clear": "Clear",
    "finder.hint.choose": "Select URLs from the list and add them.",
    "table.header.sitemap": "Source",
    "table.header.tags": "Tags",
    "table.header.count": "URL Count",
    "table.header.frequency": "Refresh Rate",
    "table.header.lastUpdated": "Last Updated",
    "table.header.actions": "Actions",
    "table.expanded.urlLabel": "Sitemap URL",
    "table.expanded.actions": "Action Center",
    "table.count.aria": "{label} total {count}",
    "table.empty": "No data yet.",
    "table.noResults": "No matching results found.",
    "table.errorPrefix": "Error:",
    "status.refresh.summary": "{success} sitemaps updated, {failed} failed.",
    "status.refresh.successOnly": "{success} sitemaps updated successfully.",
    "status.refresh.successChunk": "{success} sitemaps updated,",
    "status.refresh.failChunk": "{failed} failed.",
    "status.refresh.unreachable":
      "Sitemaps could not be loaded. Network or CORS restrictions may be blocking the requests.",
    "status.tag.added": "Tag added.",
    "status.tag.enter": "Please enter a tag.",
    "status.tag.duplicate": "This tag already exists.",
    "status.tag.notFound": "Tag not found.",
    "status.tag.removed": "Tag removed.",
    "status.sitemap.notFound": "Sitemap not found. Please refresh the list.",
    "status.notifications.enableFirst": "\u00D6nce bu sitemap i\u00E7in bildirimleri a\u00E7\u0131n.",
    "status.title.unchanged": "Ba\u015Fl\u0131k de\u011Fi\u015Fmedi.",
    "status.title.updated": "Sitemap ba\u015Fl\u0131\u011F\u0131 g\u00FCncellendi.",
    "status.email.requireRecipient": "E-posta bildirimlerini a\u00E7mak i\u00E7in en az bir ge\u00E7erli adres ekleyin.",
    "status.sitemap.none": "Sitemap bulunmuyor.",
    "status.notification.testSent": "{title} i\u00E7in test bildirimi g\u00F6nderildi.",
    "status.email.enableFirst": "Ã–nce e-posta bildirimlerini etkinle\u015Ftirip al\u0131c\u0131 ekleyin.",
    "status.email.sending": "{title} i\u00E7in test e-postas\u0131 g\u00F6nderiliyor...",
    "status.email.sent": "{title} i\u00E7in test e-postas\u0131 g\u00F6nderildi.",
    "status.title.unchanged": "Ba\u015Fl\u0131k de\u011Fi\u015Fmedi.",
    "status.title.updated": "Sitemap ba\u015Fl\u0131\u011F\u0131 g\u00FCncellendi.",
    "status.email.requireRecipient": "E-posta bildirimlerini a\u00E7mak i\u00E7in en az bir ge\u00E7erli adres ekleyin.",
    "status.sitemap.none": "Sitemap bulunmuyor.",
    "status.title.unchanged": "Title is unchanged.",
    "status.title.updated": "Sitemap title updated.",
    "status.email.requireRecipient": "Add at least one valid email address to enable email notifications.",
    "status.sitemap.none": "No sitemaps available.",
    "settings.title": "Brevo Email Settings",
    "settings.description":
      "Enter your Brevo API key and sender info. Leave blank if you do not want to update the key.",
    "settings.apiKeyLabel": "Brevo API Key",
    "settings.apiKeyHint": "Existing key is kept unless you provide a new one.",
    "settings.senderNameLabel": "Sender Name",
    "settings.senderEmailLabel": "Sender Email",
    "settings.testButton": "Test API Key",
    "settings.saveButton": "Save",
    "details.title": "Details",
    "details.searchPlaceholder": "Search within URLs...",
    "details.filter.start": "Start",
    "details.filter.end": "End",
    "details.groupLabel": "URL Group",
    "details.groups": "URL groups",
    "details.groups.empty": "No groups available",
    "details.more": "Show more",
    "details.more.empty": "No other groups",
    "details.status.idle": "Select a sitemap to browse its URL list.",
    "details.status.loading": "Loading data for {title}...",
    "details.status.loadedCount": "{count} records found.",
    "details.status.loadError": "This sitemap could not be loaded: {error}",
    "details.status.fetchError":
      "Details could not be loaded: {error}. Network or CORS restrictions may block the request.",
    "details.status.noData": "No records were found for this sitemap.",
    "details.status.filteredEmpty": "Filters left no records. Try broadening your criteria.",
    "details.status.summary": "{count} records listed.",
    "details.status.summaryFiltered": "{count} records found ({filters}), showing {pageCount}.",
    "details.status.filter.search": "search",
    "details.status.filter.group": "{label} group",
    "details.status.filter.date": "date filter",
    "details.chart.title": "Last 7 Days of Updates",
    "details.chart.titleDynamic": "Update frequency over the last {days} days",
    "details.chart.days7": "7 Days",
    "details.chart.days14": "14 Days",
    "details.chart.days30": "30 Days",
    "details.chart.seriesLabel": "Updated URLs",
    "details.chart.label.today": "Today",
    "details.chart.label.yesterday": "Yesterday",
    "details.chart.tooltip": "{count} URLs updated",
    "details.table.link": "URL",
    "details.table.child": "Child Sitemap",
    "details.table.lastUpdated": "Last Updated",
    "details.table.count200": "200",
    "details.table.count301": "301",
    "details.table.count404": "404",
    "details.table.count4xx": "4xx",
    "details.table.count500": "500",
    "details.table.countOther": "Other",
    "details.table.score": "Score",
    "details.table.lastCrawl": "Last Crawl",
    "details.metadata.titleLabel": "Title",
    "details.metadata.descriptionLabel": "Description",
    "details.metadata.loading": "Loading page metadata...",
    "details.metadata.empty": "No metadata available for this URL.",
    "details.metadata.error": "Metadata could not be loaded: {error}",
    "details.metadata.toggle": "Toggle metadata details",
    "details.metadata.tab.content": "Content",
    "details.metadata.tab.layout": "Layout",
    "details.metadata.tab.schema": "Schema",
    "details.metadata.headingsLabel": "Headings",
    "details.metadata.headingLinksLabel": "Links inside headings",
    "details.metadata.layout.empty": "No layout data available.",
    "details.metadata.schema.empty": "No schema data found.",
    "details.metadata.schema.blockLabel": "Schema block {index}",
    "details.empty.noSelection": "No sitemap selected.",
    "details.domain.title": "{domain}",
    "details.domain.sitemapList": "Sitemaps",
    "details.domain.open": "Open",
    "details.domain.empty": "No sitemaps were found for this domain.",
    "details.domain.emptyStatus": "No sitemaps for {domain}.",
    "details.domain.summary": "{count} sitemaps listed for {domain}.",
    "details.empty.noData": "No data to display.",
    "details.empty.filtered": "No results match your filters.",
    "details.error.load": "The sitemap could not be loaded. Enter a valid URL to view it.",
    "details.pagination.previous": "Previous",
    "details.pagination.next": "Next",
    "details.pagination.info": "Showing {start}-{end} / {total} (Page {current} / {pages})",
    "details.exportButton": "Export to Sheet",
    "details.export.loading": "Hold on, data is still loading.",
    "details.export.noData": "There is no data to export yet.",
    "details.export.success": "Export ready, CSV download started.",
    "details.export.error": "Export failed, please try again.",
    "details.scanButton": "Start Scan",
    "details.scanPauseButton": "Pause",
    "details.scanResumeButton": "Resume",
    "details.scanStopButton": "Stop",
    "details.status.scanRunning": "Scan started. Fetching metadata...",
    "details.status.scanCompleted": "Scan completed.",
    "details.status.scanFailed": "Scan failed: {error}",
    "details.status.scanPaused": "Scan paused.",
    "details.status.scanStopped": "Scan stopped.",
    "details.scan.noData": "No URLs available to scan.",
    "details.singleScan.start": "Single crawl started.",
    "details.singleScan.done": "Single crawl completed.",
    "details.singleScan.error": "Single crawl failed: {error}",
    "details.singleScan.improved": "Single crawl improved score from {from} to {to}.",
    "details.singleScan.regressed": "Single crawl lowered score from {from} to {to}.",
    "details.singleScan.unchanged": "Single crawl finished, score stayed at {score}.",
    "details.metadata.progress": "Metadata (page): {done}/{total}",
    "details.metadata.progressDone": "Metadata (page) completed: {done}/{total}",
    "details.metadata.progressWithLast": "Metadata (page): {done}/{total} | Last: {url}",
    "details.metadata.progressDoneWithLast": "Metadata (page) completed: {done}/{total} | Last: {url}",
    "details.headingLinks.progress": "Heading link check (page): {done}/{total}",
    "details.headingLinks.progressDone": "Heading link check (page) completed: {done}/{total}",
    "details.metadata.notStarted": "Scan not started. Click Start Scan to load metadata.",
    "details.scan.last": "Last scan: {timestamp}",
    "details.tabs.aria": "Details tabs",
    "details.tab.urls": "URL List",
    "details.tab.discovery": "Discovery",
    "details.issues.label": "Issue Group",
    "details.issues.groups": "Issue groups",
    "details.issues.empty": "No issue groups available",
    "details.issues.any": "Issues",
    "details.issues.2xx": "2xx",
    "details.issues.3xx": "3xx",
    "details.issues.404": "404",
    "details.issues.4xx": "4xx",
    "details.issues.5xx": "5xx",
    "details.issues.other": "Other",
    "details.actions.scanSingle": "Run single crawl",
    "details.actions.openUrl": "Open URL",
    "details.actions.copyUrl": "Copy URL",
    "details.actions.compareAdd": "Add to compare",
    "details.actions.linkMapBuild": "Build link map",
    "details.actions.linkMapCancel": "Cancel link map",
    "details.actions.linkMapExport": "Export link map",
    "details.linkMap.start": "Internal link map build started for {title}.",
    "details.linkMap.done": "Internal link map ready. Pages: {pages}, Links: {links}.",
    "details.linkMap.loading": "Loading saved link map...",
    "details.linkMap.building": "Building internal link map...",
    "details.linkMap.empty": "No internal links found yet.",
    "details.linkMap.error": "Internal link map failed: {error}",
    "details.linkMap.exported": "Internal link map CSV downloaded.",
    "details.linkMap.exportError": "Could not export internal link map: {error}",
    "details.linkMap.summary": "Pages: {pages} | Links: {links} | Orphans: {orphans} | Failed: {failed}",
    "details.linkMap.preview": "Top internal links",
    "details.linkMap.progress": "Processing {processed} / {total} URLs ({percent}%)",
    "details.linkMap.eta": "ETA: ~{seconds}s",
    "details.linkMap.jobQueued": "Link map job queued...",
    "details.linkMap.jobError": "Link map job failed: {error}",
    "details.linkMap.jobCancelled": "Link map job cancelled.",
    "details.linkMap.cancelRequested": "Link map cancel requested.",
    "details.linkMap.notifyTitle": "Link map ready",
    "details.linkMap.notifyBody": "{title}: {links} internal links found.",
    "table.expanded.linkMap": "Internal link map",
    "details.toast.copySuccess": "URL copied to clipboard.",
    "details.toast.copyFail": "Could not copy URL.",
    "details.toast.openFail": "Could not open URL.",
    "details.compare.title": "Compare URLs",
    "details.compare.clear": "Clear",
    "details.compare.remove": "Remove",
    "details.compare.close": "Close",
    "details.compare.metrics.headings": "Headings",
    "details.compare.metrics.links": "Links",
    "details.compare.metrics.schema": "Schema blocks",
    "details.compare.metrics.schemaTypes": "Schema types",
    "details.compare.metrics.layoutDepth": "Layout depth",
    "details.compare.metrics.layoutCount": "Layout items",
    "details.compare.metrics.paragraphs": "Paragraphs",
    "details.compare.metrics.status": "Status",
    "details.compare.metrics.description": "Description",
    "details.compare.matrix.title": "Feature Matrix",
    "details.compare.matrix.metric": "Metric",
    "details.compare.schema.title": "Schema Type Diff",
    "details.compare.schema.present": "Present in selected pages",
    "details.compare.schema.none": "No schema type data.",
    "details.compare.content.title": "Content (P) Diff",
    "details.compare.content.summary": "+{added} / -{removed} (same: {same})",
    "details.compare.content.added": "Added",
    "details.compare.content.removed": "Removed",
    "details.compare.content.none": "No paragraph changes.",
    "details.compare.content.more": "{count} more...",
    "details.compare.cta.ready": "Compare",
    "details.compare.cta.waiting": "Select at least 2 URLs to compare",
    "details.fetchNote.puppeteer": "WAF detected, Puppeteer fallback used.",
    "details.fetchNote.staleWaf": "WAF blocked, showing last good data.",
    "details.fetchNote.html": "WAF blocked (HTML response).",
    "datetime.unknown": "Not specified",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.edit": "Edit",
    "button.view": "View",
    "button.emailSettings": "Email Settings",
    "button.testNotification": "Send Test Notification",
    "button.testEmail": "Send Test Email",
    "button.remove": "Remove",
    "button.tagAdd": "Add Tag",
    "button.tagCancel": "Cancel",
    "button.tagCreate": "Add",
    "button.notification.enable": "Enable Notifications",
    "button.notification.disable": "Disable Notifications",
    "toggle.notifications.on": "Notifications On",
    "toggle.notifications.off": "Notifications Off",
    "notifications.unsupported": "Notifications aren't supported here",
    "notifications.unsupportedHint": "This browser doesn't support the Notification API.",
    "notifications.blocked": "Notifications are blocked",
    "notifications.blockedHint": "Allow notifications in your browser settings to enable this feature.",
    "notifications.toggle.enableTitle": "Get alerts when sitemap data changes",
    "notifications.toggle.disableTitle": "Disable browser notifications",
    "notifications.error.denied": "Notification permission was not granted.",
    "notifications.error.generic": "An error occurred while requesting notification permission.",
    "notification.center.open": "Open notifications",
    "notification.center.close": "Close notifications",
    "notification.center.title": "Notifications",
    "notification.center.empty": "Everything looks good for now.",
    "notification.center.readAll": "Mark all as read",
    "notification.center.severity.high": "High",
    "notification.center.severity.medium": "Medium",
    "notification.center.severity.low": "Info",
    "notification.center.relative.now": "just now",
    "email.settings.info": "Add one email address per line.",
    "email.settings.toggle": "Email notifications active",
    "email.settings.save": "Save",
    "email.settings.cancel": "Cancel",
    "updateRate.tooltip": "Total of {total} URLs updated in the last 7 days",
    "updateRate.perDay": "{value}/day",
    "updateRate.perWeek": "{value}/week",
    "updateRate.none": "\u2014",
    "language.label": "Language",
    "language.option.en": "English",
    "language.option.tr": "Turkish"
  },
  tr: {
    "menu.open": "Men\u00FCy\u00FC a\u00E7",
    "menu.close": "Men\u00FCy\u00FC gizle",
    "sidebar.aria": "Ana gezinme",
    "status.online": "\u00C7evrimi\u00E7i",
    "nav.dashboard": "Panel",
    "nav.reports": "Raporlar (yak\u0131nda)",
    "nav.settings": "Ayarlar",
    "nav.logout": "\\u00C7\\u0131k\\u0131\\u015F Yap",
    "nav.menu": "Ana men\u00FC",
    "controls.filter": "Filtrele",
    "controls.searchPlaceholder": "URL veya ba\u015Fl\u0131k ara",
    "controls.refresh": "Yenile",
    "controls.refreshLoading": "Y\u00fckleniyor...",
    "controls.notifications.enable": "Bildirimleri A\u00E7",
    "controls.notifications.disable": "Bildirimleri Kapat",
    "controls.notifications.label": "Bildirimler",
    "controls.exportCsv": "CSV disari aktar",
    "controls.exportJson": "JSON disari aktar",
    "controls.alertsOnly": "Sadece uyari goster",
    "controls.export.noData": "Aktarilacak veri yok.",
    "controls.export.success": "Disari aktarma basladi.",
    "controls.export.error": "Disari aktarma basarisiz.",
    "notifications.enabled": "Bildirimler etkinleÅŸtirildi. GÃ¼ncellemeler olduÄŸunda haber vereceÄŸiz.",
    "notifications.disabled": "Bildirimler devre dÄ±ÅŸÄ± bÄ±rakÄ±ldÄ±.",
    "domain.label": "Alan Ad\\u0131",
    "domain.filters": "Alan ad\u0131 filtreleri",
    "filters.all": "Hepsi",
    "tags.label": "Etiket",
    "tags.filters": "Etiket filtreleri",
    "tags.empty": "Etiket yok",
    "tags.addTitle": "Etiket ekle",
    "tags.addPlaceholder": "Etiket",
    "tags.addEmpty": "Yeni etiket ekleyin",
    "tags.removeAria": "{tag} etiketini sil",
    "adder.title": "Sitemap Ekle",
    "adder.field.title": "Ba\u015Fl\u0131k",
    "adder.field.titlePlaceholder": "\u00D6rnek: Blog Sitemap",
    "adder.field.url": "URL",
    "adder.field.urlPlaceholder": "https://site.com/sitemap.xml",
    "adder.submit": "Ekle",
    "adder.feedTitle": "RSS Akisi Ekle",
    "adder.feedDescription": "RSS/Atom akislari icin ayri bir alan kullanin.",
    "adder.feed.urlPlaceholder": "https://site.com/rss.xml",
    "adder.feed.submit": "Akisi Ekle",
    "adder.tabs.aria": "Sitemap araclari",
    "adder.tab.discover": "Kesfet",
    "adder.tab.addSitemap": "Sitemap Ekle",
    "adder.tab.addRss": "RSS Ekle",
    "finder.title": "Sitemap Kesfi",
    "finder.description": "Bir alan adini tarayarak sitemap veya feed URL'lerini otomatik bul.",
    "finder.field.domain": "Alan adi veya URL",
    "finder.field.placeholder": "ornek.com",
    "finder.submit": "Tara",
    "finder.submitLoading": "Taraniyor...",
    "finder.status.idle": "Aramayi baslatmak icin alan adi girin.",
    "finder.status.loading": "{domain} taraniyor...",
    "finder.status.success": "{domain} icin {count} aday bulundu.",
    "finder.status.empty": "{domain} icin sitemap benzeri URL bulunamadi.",
    "finder.status.error": "Kesif basarisiz: {error}",
    "finder.empty": "Henuz sonuc yok.",
    "finder.results.source.dom": "HTML",
    "finder.results.source.robots": "Robots.txt",
    "finder.results.source.guess": "Tahmini yol",
    "finder.results.source.child": "Sitemap indeks",
    "finder.results.added": "Listede mevcut",
    "finder.results.status.valid": "Dogrulandi",
    "finder.results.status.invalid": "Erisilemedi",
    "finder.results.status.code": "HTTP {status}",
    "finder.results.reason.html": "HTML sayfa",
    "finder.results.reason.invalidXml": "Gecerli XML degil",
    "finder.parentLabel": "{parent} icinde bulundu",
    "finder.countLabel": "{count} URL",
    "finder.addSingle": "Ekle",
    "finder.addSelected": "Secileni ekle",
    "finder.clear": "Temizle",
    "finder.hint.choose": "Listeden secip ekleyebilirsiniz.",
    "table.header.sitemap": "Kaynak",
    "table.header.tags": "Etiketler",
    "table.header.count": "URL Say\u0131s\u0131",
    "table.header.frequency": "Yenilenme",
    "table.header.lastUpdated": "Son G\u00FCncelleme",
    "table.header.actions": "\u0130\u015Flemler",
    "table.expanded.urlLabel": "Sitemap URL",
    "table.expanded.actions": "Ä°\u015Flem Merkezi",
    "table.count.aria": "{label} toplam {count}",
    "table.empty": "Hen\u00FCz veri yok.",
    "table.noResults": "\u0130lgili sonu\u00E7 bulunamad\u0131.",
    "table.errorPrefix": "Hata:",
    "status.refresh.summary": "{success} sitemap g\u00FCncellendi, {failed} sitemap hata verdi.",
    "status.refresh.successOnly": "{success} sitemap ba\u015Far\u0131yla g\u00FCncellendi.",
    "status.refresh.successChunk": "{success} sitemap g\u00FCncellendi,",
    "status.refresh.failChunk": "{failed} sitemap hata verdi.",
    "status.refresh.unreachable":
      "Sitemap'ler y\u00FCklenemedi. CORS veya a\u011F k\u0131s\u0131tlamalar\u0131 isteklere engel olabilir.",
    "status.tag.added": "Etiket eklendi.",
    "status.tag.enter": "L\u00FCtfen bir etiket girin.",
    "status.tag.duplicate": "Bu etiket zaten mevcut.",
    "status.tag.notFound": "Etiket bulunamad\u0131.",
    "status.tag.removed": "Etiket kald\u0131r\u0131ld\u0131.",
    "status.sitemap.notFound": "Sitemap bulunamad\u0131. Listeyi yenileyin.",
    "status.notifications.enableFirst": "\u00D6nce bu sitemap i\u00E7in bildirimleri a\u00E7\u0131n.",
    "settings.title": "Brevo E-posta Ayarlar\u0131",
    "settings.description":
      "Brevo API anahtar\u0131n\u0131z\u0131 ve g\u00F6nderici bilgilerinizi girin. Anahtar\u0131 g\u00FCncellemek istemiyorsan\u0131z bo\u015F b\u0131rak\u0131n.",
    "settings.apiKeyLabel": "Brevo API Anahtar\u0131",
    "settings.apiKeyHint": "Yeni anahtar girmezseniz mevcut anahtar korunur.",
    "settings.senderNameLabel": "G\u00F6nderici Ad\u0131",
    "settings.senderEmailLabel": "G\u00F6nderici E-posta",
    "settings.testButton": "API Anahtar\u0131n\u0131 Test Et",
    "settings.saveButton": "Kaydet",
    "details.title": "Detaylar",
    "details.searchPlaceholder": "URL'lerde ara...",
    "details.filter.start": "Ba\u015Flang\u0131\u00E7",
    "details.filter.end": "Biti\u015F",
    "details.groupLabel": "URL Grubu",
    "details.groups": "URL gruplar\u0131",
    "details.groups.empty": "Grup bulunmuyor",
    "details.more": "Daha fazlas\u0131",
    "details.more.empty": "Ba\u015Fka grup yok",
    "details.status.idle": "Bir sitemap se\u00E7erek i\u00E7indeki URL listesini g\u00F6rebilirsiniz.",
    "details.status.loading": "{title} i\u00E7in veriler y\u00FCkleniyor...",
    "details.status.loadedCount": "{count} kay\u0131t bulundu.",
    "details.status.loadError": "Bu sitemap y\u00FCklenemedi: {error}",
    "details.status.fetchError":
      "Detaylar y\u00FCklenemedi: {error}. CORS ya da a\u011F k\u0131s\u0131tlar\u0131 iste\u011Fi engelliyor olabilir.",
    "details.status.noData": "Bu sitemap i\u00E7in kay\u0131t bulunamad\u0131.",
    "details.status.filteredEmpty": "Filtreler sonucunda kay\u0131t kalmad\u0131. Kriterleri geni\u015Fletmeyi deneyin.",
    "details.status.summary": "{count} kay\u0131t listeleniyor.",
    "details.status.summaryFiltered":
      "{count} kay\u0131t bulundu ({filters}), {pageCount} kay\u0131t g\u00F6steriliyor.",
    "details.status.filter.search": "arama",
    "details.status.filter.group": "{label} grubu",
    "details.status.filter.date": "tarih filtresi",
    "details.chart.title": "Son 7 G\u00FCnl\u00FCk G\u00FCncelleme",
    "details.chart.titleDynamic": "Son {days} g\u00FCnl\u00FCk g\u00FCncelleme s\u0131kl\u0131\u011F\u0131",
    "details.chart.days7": "7 G\u00FCn",
    "details.chart.days14": "14 G\u00FCn",
    "details.chart.days30": "30 G\u00FCn",
    "details.chart.seriesLabel": "G\u00FCncellenen URL Say\u0131s\u0131",
    "details.chart.label.today": "Bug\u00FCn",
    "details.chart.label.yesterday": "D\u00FCn",
    "details.chart.tooltip": "{count} URL g\u00FCncellendi",
    "details.table.link": "Ba\u011Flant\u0131",
    "details.table.child": "Alt Sitemap",
    "details.table.lastUpdated": "Son G\u00FCncelleme",
    "details.table.count200": "200",
    "details.table.count301": "301",
    "details.table.count404": "404",
    "details.table.count4xx": "4xx",
    "details.table.count500": "500",
    "details.table.countOther": "Diger",
    "details.table.score": "Puan",
    "details.table.lastCrawl": "Son Tarama",
    "details.actions.scanSingle": "Tekli tarama baslat",
    "details.actions.openUrl": "URL'yi ac",
    "details.actions.copyUrl": "URL kopyala",
    "details.actions.compareAdd": "Karsilastirmaya ekle",
    "details.actions.linkMapBuild": "Link haritasi olustur",
    "details.actions.linkMapCancel": "Link haritasi iptal et",
    "details.actions.linkMapExport": "Link haritasini disa aktar",
    "details.linkMap.start": "{title} icin internal link haritasi baslatildi.",
    "details.linkMap.done": "Internal link haritasi hazir. Sayfalar: {pages}, Linkler: {links}.",
    "details.linkMap.loading": "Kayitli link haritasi yukleniyor...",
    "details.linkMap.building": "Internal link haritasi olusturuluyor...",
    "details.linkMap.empty": "Henuz internal link bulunamadi.",
    "details.linkMap.error": "Internal link haritasi olusturulamadi: {error}",
    "details.linkMap.exported": "Internal link haritasi CSV indirildi.",
    "details.linkMap.exportError": "Internal link haritasi disa aktarilamadi: {error}",
    "details.linkMap.summary": "Sayfalar: {pages} | Linkler: {links} | Yetim: {orphans} | Hata: {failed}",
    "details.linkMap.preview": "En cok gecen internal linkler",
    "details.linkMap.progress": "{processed} / {total} URL isleniyor (%{percent})",
    "details.linkMap.eta": "Kalan sure: ~{seconds} sn",
    "details.linkMap.jobQueued": "Link haritasi isi kuyruga alindi...",
    "details.linkMap.jobError": "Link haritasi isi basarisiz: {error}",
    "details.linkMap.jobCancelled": "Link haritasi isi iptal edildi.",
    "details.linkMap.cancelRequested": "Link haritasi iptal talebi gonderildi.",
    "details.linkMap.notifyTitle": "Link haritasi hazir",
    "details.linkMap.notifyBody": "{title}: {links} internal link bulundu.",
    "table.expanded.linkMap": "Internal link haritasi",
    "details.toast.copySuccess": "URL panoya kopyalandi.",
    "details.toast.copyFail": "URL kopyalanamadi.",
    "details.toast.openFail": "URL acilamadi.",
    "details.compare.title": "URL karsilastirma",
    "details.compare.clear": "Temizle",
    "details.compare.remove": "Kaldir",
    "details.compare.close": "Kapat",
    "details.compare.metrics.headings": "Basliklar",
    "details.compare.metrics.links": "Baglantilar",
    "details.compare.metrics.schema": "Schema bloklari",
    "details.compare.metrics.schemaTypes": "Schema tipleri",
    "details.compare.metrics.layoutDepth": "Layout derinligi",
    "details.compare.metrics.layoutCount": "Layout ogeleri",
    "details.compare.metrics.paragraphs": "Paragraflar",
    "details.compare.metrics.status": "Durum",
    "details.compare.metrics.description": "Aciklama",
    "details.compare.matrix.title": "Ozellik Matrisi",
    "details.compare.matrix.metric": "Metrik",
    "details.compare.schema.title": "Schema Tipi Farki",
    "details.compare.schema.present": "Secili sayfalarda mevcut",
    "details.compare.schema.none": "Schema tipi verisi yok.",
    "details.compare.content.title": "Icerik (P) Farki",
    "details.compare.content.summary": "+{added} / -{removed} (ayni: {same})",
    "details.compare.content.added": "Eklenen",
    "details.compare.content.removed": "Kaldirilan",
    "details.compare.content.none": "Paragraf degisikligi yok.",
    "details.compare.content.more": "{count} tane daha...",
    "details.compare.cta.ready": "Karsilastir",
    "details.compare.cta.waiting": "Karsilastirma icin en az 2 URL sec",
    "details.metadata.titleLabel": "Ba\u015Fl\u0131k",
    "details.metadata.descriptionLabel": "A\u00E7\u0131klama",
    "details.metadata.loading": "Sayfa bilgileri y\u00FCkleniyor...",
    "details.metadata.empty": "Bu URL i\u00E7in metadata bulunamad\u0131.",
    "details.metadata.error": "Metadata y\u00FCklenemedi: {error}",
    "details.metadata.toggle": "Sat\u0131r detay\u0131n\u0131 a\u00E7/kapat",
    "details.metadata.tab.content": "\u0130\u00E7erik",
    "details.metadata.tab.layout": "Layout",
    "details.metadata.tab.schema": "Schema",
    "details.metadata.headingsLabel": "Ba\u015Fl\u0131k Yap\u0131s\u0131",
    "details.metadata.headingLinksLabel": "Ba\u015Fl\u0131klardaki Ba\u011Flant\u0131lar",
    "details.metadata.layout.empty": "Layout verisi bulunamad\u0131.",
    "details.metadata.schema.empty": "Schema verisi bulunamad\u0131.",
    "details.metadata.schema.blockLabel": "Schema blok {index}",
    "details.empty.noSelection": "Se\u00E7ili sitemap yok.",
    "details.domain.title": "{domain}",
    "details.domain.sitemapList": "Sitemap listesi",
    "details.domain.open": "Ac",
    "details.domain.empty": "Bu alan adi icin sitemap bulunamadi.",
    "details.domain.emptyStatus": "{domain} icin sitemap bulunamadi.",
    "details.domain.summary": "{domain} icin {count} sitemap listelendi.",
    "details.error.load": "Sitemap y\u00FCklenemedi. G\u00F6r\u00FCnt\u00Fclemek i\u00E7in ge\u00E7erli bir URL girin.",
    "details.pagination.previous": "\u00D6nceki",
    "details.pagination.next": "Sonraki",
    "details.pagination.info": "{start}-{end} / {total} kay\u0131t (Sayfa {current} / {pages})",
    "details.exportButton": "Sheet'e Aktar",
    "details.export.loading": "Veriler y\u00FCklenirken d\u0131\u015Fa aktarma yap\u0131lamaz.",
    "details.export.noData": "Aktar\u0131lacak veri bulunamad\u0131.",
    "details.export.success": "Aktar\u0131m haz\u0131r, CSV indirmesi ba\u015Flad\u0131.",
    "details.export.error": "Aktar\u0131m ba\u015Far\u0131s\u0131z, l\u00FCtfen tekrar deneyin.",
    "details.singleScan.improved": "Tekli tarama puani {from} -> {to} olacak sekilde iyilesti.",
    "details.singleScan.regressed": "Tekli tarama puani {from} -> {to} olarak dustu.",
    "details.singleScan.unchanged": "Tekli tarama tamamlandi, puan ayni kaldi ({score}).",
    "datetime.unknown": "Belirtilmemi\u015F",
    "button.save": "Kaydet",
    "button.cancel": "Vazge\u00E7",
    "button.edit": "D\u00FCzenle",
    "button.view": "G\u00F6r\u00FCnt\u00FCle",
    "button.emailSettings": "E-posta Ayarlar\u0131",
    "button.testNotification": "Test Bildirimi",
    "button.testEmail": "Test E-posta",
    "button.remove": "Kald\u0131r",
    "button.tagAdd": "Etiket Ekle",
    "button.tagCancel": "Vazge\u00E7",
    "button.tagCreate": "Ekle",
    "button.notification.enable": "Bildirimleri A\u00E7",
    "button.notification.disable": "Bildirimleri Kapat",
    "toggle.notifications.on": "Bildirim A\u00E7\u0131k",
    "toggle.notifications.off": "Bildirim Kapal\u0131",
    "notifications.unsupported": "Bildirimler bu ortamda desteklenmiyor",
    "notifications.unsupportedHint": "Bu taray\u0131c\u0131 Notification API'sini desteklemiyor.",
    "notifications.blocked": "Bildirimler engellenmi\u015F",
    "notifications.blockedHint": "Taray\u0131c\u0131 ayarlar\u0131ndan bildirimlere izin vererek bu \u00F6zelli\u011Fi a\u00E7abilirsiniz.",
    "notifications.toggle.enableTitle": "Sitemap de\u011Fi\u015Fikliklerinde bildirim al",
    "notifications.toggle.disableTitle": "Taray\u0131c\u0131 bildirimlerini kapat",
    "notifications.error.denied": "Bildirim izni verilmedi.",
    "notifications.error.generic": "Bildirim izni istenirken bir hata olu\u015Ftu.",
    "notification.center.open": "Bildirimleri ac",
    "notification.center.close": "Bildirim panelini kapat",
    "notification.center.title": "Bildirimler",
    "notification.center.empty": "Simdilik her sey yolunda.",
    "notification.center.readAll": "Tumunu okundu yap",
    "notification.center.severity.high": "Kritik",
    "notification.center.severity.medium": "Uyari",
    "notification.center.severity.low": "Bilgi",
    "notification.center.relative.now": "simdi",
    "email.settings.info": "Her sat\u0131ra bir e-posta adresi olacak \u015Fekilde al\u0131c\u0131lar\u0131 ekleyin.",
    "email.settings.toggle": "E-posta bildirimleri aktif",
    "email.settings.save": "Kaydet",
    "email.settings.cancel": "Vazge\u00E7",
    "updateRate.tooltip": "Son 7 g\u00FCnde toplam {total} URL g\u00FCncellendi",
    "updateRate.perDay": "{value}/g\u00FCn",
    "updateRate.perWeek": "{value}/hafta",
    "updateRate.none": "\u2014",
    "language.label": "Dil",
    "language.option.en": "English",
    "language.option.tr": "T\u00FCrk\u00E7e"
  },
};

function loadLanguagePreference() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    // Ignore storage errors
  }
  return DEFAULT_LANGUAGE;
}

let currentLanguage = loadLanguagePreference();
let dateFormatter;
let numberFormatter;
let momentCalendarConfig;

function saveLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    // Ignore storage errors
  }
}

function t(key, vars = {}) {
  const active = I18N_STRINGS[currentLanguage] || {};
  const fallback = I18N_STRINGS[DEFAULT_LANGUAGE] || {};
  let template = active[key] ?? fallback[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token) => {
    return token in vars ? String(vars[token]) : `{${token}}`;
  });
}

function applyStaticTranslations(root = document) {
  root.querySelectorAll("[data-i18n-key]").forEach((element) => {
    const key = element.dataset.i18nKey;
    if (!key) {
      return;
    }
    const target = element.dataset.i18nTarget || "text";
    const value = t(key);
    if (target === "html") {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const descriptor = element.dataset.i18nAttr;
    if (!descriptor) {
      return;
    }
    descriptor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((item) => {
        const [attr, key] = item.split(":").map((part) => part.trim());
        if (attr && key) {
          element.setAttribute(attr, t(key));
        }
      });
  });
}

function setLanguage(lang, { persist = true } = {}) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }
  currentLanguage = lang;
  if (persist) {
    saveLanguagePreference(lang);
  }
  document.documentElement.setAttribute("lang", lang);
  dateFormatter = createDateFormatter();
  numberFormatter = createNumberFormatter();
  momentCalendarConfig = createMomentCalendarConfig(lang);
  if (typeof moment !== "undefined" && typeof moment.locale === "function") {
    moment.locale(getMomentLocale(lang));
  }
}

setLanguage(currentLanguage, { persist: false });
applyStaticTranslations();

const DEFAULT_SOURCE_TYPE = "sitemap";
const SOURCE_TYPE_LABELS = {
  en: {
    sitemap: { label: "Sitemap", lower: "sitemap" },
    rss: { label: "RSS Feed", lower: "rss feed" },
  },
  tr: {
    sitemap: { label: "Sitemap", lower: "sitemap" },
    rss: { label: "RSS Akisi", lower: "rss akisi" },
  },
};

function getSourceLabel(type, { lowercase = false } = {}) {
  const locale = SOURCE_TYPE_LABELS[currentLanguage] || SOURCE_TYPE_LABELS.en;
  const entry = locale?.[type] || locale.sitemap;
  return lowercase ? entry.lower : entry.label;
}

function normalizeSourceType(value) {
  if (typeof value !== "string") {
    return DEFAULT_SOURCE_TYPE;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return DEFAULT_SOURCE_TYPE;
  }
  if (normalized === "feed") {
    return "rss";
  }
  return normalized === "rss" ? "rss" : DEFAULT_SOURCE_TYPE;
}

const DEFAULT_SITEMAPS = [
  {
    title: "Acibadem - Genel Sitemap",
    url: "https://www.acibadem.com.tr/sitemap.xml",
    sourceType: DEFAULT_SOURCE_TYPE,
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
  },
  {
    title: "Memorial - Saglik Rehberi",
    url: "https://www.memorial.com.tr/sitemaps/sitemaps-details/tr-saglik-rehberi.xml",
    sourceType: DEFAULT_SOURCE_TYPE,
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
  },
];

const SIDEBAR_STATE_KEY = "sitemapflow:sidebar";
const NOTIFICATION_PREF_KEY = "sitemapflow:notifications-enabled";
const ALERTS_ONLY_KEY = "sitemapflow:alerts-only";
const TABLE_PER_PAGE_KEY = "sitemapflow:table-per-page";
const NOTIFICATION_CHECK_INTERVAL = 5 * 60 * 1000;
const appShell = document.querySelector(".app-shell");
const sidebarElement = document.querySelector("#sidebar");
const sidebarToggleElements = document.querySelectorAll("[data-role='sidebar-toggle']");
const languageSelect = document.querySelector("#languageSelect");

const DETAIL_LOCALE_SEGMENTS = new Set(["tr", "en", "de", "fr", "ru", "ar", "it", "es", "nl", "az", "ku"]);
const DETAIL_MAX_INLINE_GROUPS = 3;
const TABLE_PER_PAGE_OPTIONS = [20, 50, 100];

const isDesktopViewport = () => window.matchMedia("(min-width: 1024px)").matches;

const readSidebarPreference = () => {
  try {
    return localStorage.getItem(SIDEBAR_STATE_KEY);
  } catch (error) {
    return null;
  }
};

const writeSidebarPreference = (value) => {
  try {
    localStorage.setItem(SIDEBAR_STATE_KEY, value);
  } catch (error) {
    // Depolama kullanilamiyorsa sessizce devam et.
  }
};

const readAlertsOnlyPreference = () => {
  try {
    return localStorage.getItem(ALERTS_ONLY_KEY) === "1";
  } catch (error) {
    return false;
  }
};

const readTablePerPagePreference = () => {
  try {
    const raw = localStorage.getItem(TABLE_PER_PAGE_KEY);
    const value = Number(raw);
    return TABLE_PER_PAGE_OPTIONS.includes(value) ? value : null;
  } catch (error) {
    return null;
  }
};

const writeTablePerPagePreference = (value) => {
  try {
    if (!TABLE_PER_PAGE_OPTIONS.includes(value)) {
      localStorage.removeItem(TABLE_PER_PAGE_KEY);
      return;
    }
    localStorage.setItem(TABLE_PER_PAGE_KEY, String(value));
  } catch (error) {
    // Depolama kullanilamiyorsa sessizce devam et.
  }
};

const writeAlertsOnlyPreference = (value) => {
  try {
    if (value) {
      localStorage.setItem(ALERTS_ONLY_KEY, "1");
    } else {
      localStorage.removeItem(ALERTS_ONLY_KEY);
    }
  } catch (error) {
    // Depolama kullanilamiyorsa sessizce devam et.
  }
};

let isSidebarOpen = false;

function updateSidebarControls(open) {
  const label = open ? t("menu.close") : t("menu.open");
  sidebarToggleElements.forEach((button) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", label);
    const textTarget = button.querySelector("[data-role='sidebar-toggle-text']");
    if (textTarget) {
      textTarget.textContent = label;
    }
  });
}

function setSidebarState(open, { persist = true } = {}) {
  if (!appShell) {
    return;
  }
  isSidebarOpen = open;
  appShell.setAttribute("data-sidebar", open ? "open" : "collapsed");
  if (sidebarElement) {
    sidebarElement.setAttribute("aria-hidden", String(!open));
  }
  updateSidebarControls(open);

  if (persist) {
    const value = open ? "open" : "collapsed";
    writeSidebarPreference(value);
  }
}

function toggleSidebar(force) {
  const nextState = typeof force === "boolean" ? force : !isSidebarOpen;
  setSidebarState(nextState);
}

function initializeSidebar() {
  if (!appShell || !sidebarToggleElements.length) {
    return;
  }

  const storedPreference = readSidebarPreference();
  const initialOpen = storedPreference === "open";

  setSidebarState(initialOpen, { persist: false });

  sidebarToggleElements.forEach((button) => {
    button.addEventListener("click", () => {
      toggleSidebar();
    });
  });

  window.addEventListener("resize", () => {
    if (isDesktopViewport()) {
      const stored = readSidebarPreference();
      if (stored === "collapsed") {
        setSidebarState(false, { persist: false });
      } else {
        setSidebarState(true, { persist: false });
      }
      return;
    }

    const stored = readSidebarPreference();
    if (stored === "open" || stored === "collapsed") {
      setSidebarState(stored === "open", { persist: false });
    } else if (isSidebarOpen) {
      setSidebarState(false, { persist: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !isDesktopViewport() && isSidebarOpen) {
      toggleSidebar(false);
    }
  });
}

initializeSidebar();

function initializeLanguageSwitcher() {
  if (!languageSelect) {
    return;
  }

  languageSelect.value = currentLanguage;

  if (!SUPPORTED_LANGUAGES.includes(languageSelect.value)) {
    languageSelect.value = currentLanguage;
  }

  languageSelect.addEventListener("change", (event) => {
    const nextLanguage = event.target.value;
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage) || nextLanguage === currentLanguage) {
      languageSelect.value = currentLanguage;
      return;
    }

    setLanguage(nextLanguage);
    applyStaticTranslations();
    updateSidebarControls(isSidebarOpen);
    renderDomainMenu();
    renderTagMenu();
    renderTable();
    renderDetails();
    languageSelect.value = currentLanguage;
  });
}

initializeLanguageSwitcher();

function getIntlLocale(lang) {
  return lang === "tr" ? "tr-TR" : "en-US";
}

function createDateFormatter() {
  return new Intl.DateTimeFormat(getIntlLocale(currentLanguage), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function createNumberFormatter() {
  return new Intl.NumberFormat(getIntlLocale(currentLanguage));
}

function getMomentLocale(lang) {
  return lang === "tr" ? "tr" : "en";
}

function createMomentCalendarConfig(lang) {
  if (lang === "tr") {
    return {
      sameDay: "[BugÃ¼n] HH:mm",
      nextDay: "[YarÄ±n] HH:mm",
      nextWeek: "DD MMM YYYY HH:mm",
      lastDay: "[DÃ¼n] HH:mm",
      lastWeek: "DD MMM YYYY HH:mm",
      sameElse: "DD MMM YYYY HH:mm",
    };
  }
  return {
    sameDay: "[Today] HH:mm",
    nextDay: "[Tomorrow] HH:mm",
    nextWeek: "DD MMM YYYY HH:mm",
    lastDay: "[Yesterday] HH:mm",
    lastWeek: "DD MMM YYYY HH:mm",
    sameElse: "DD MMM YYYY HH:mm",
  };
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return "";
  }
}

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  const seen = new Set();
  const result = [];

  for (const raw of tags) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(trimmed);
  }

  return result;
}

function normalizeTag(tag) {
  return typeof tag === "string" ? tag.trim().toLowerCase() : "";
}

function matchesNonDomainFilters(row) {
  if (!row) {
    return false;
  }

  if (state.filter) {
    const query = state.filter;
    const textCandidates = [
      row.title || "",
      row.url || "",
      row.domain || "",
      Array.isArray(row.tags) ? row.tags.join(" ") : "",
    ];

    const hasMatch = textCandidates.some((candidate) =>
      candidate.toLowerCase().includes(query)
    );
    if (!hasMatch) {
      return false;
    }
  }

  if (state.selectedTag) {
    const normalizedTag = normalizeTag(state.selectedTag);
    const rowTags = Array.isArray(row.tags) ? row.tags : [];
    const tagMatches = rowTags.some(
      (tag) => normalizeTag(tag) === normalizedTag
    );
    if (!tagMatches) {
      return false;
    }
  }

  if (state.alertsOnly) {
    const hasAlerts =
      Boolean(row.notificationsEnabled) ||
      (Boolean(row.emailEnabled) &&
        Array.isArray(row.emailRecipients) &&
        row.emailRecipients.length > 0);
    if (!hasAlerts) {
      return false;
    }
  }

  return true;
}

function formatLabelWithCount(label, count) {
  if (!Number.isFinite(count)) {
    return { text: label, ariaLabel: label };
  }
  const formatted = numberFormatter.format(count);
  const ariaLabel = t("table.count.aria", { label, count: formatted });
  return {
    text: `${label} (${formatted})`,
    ariaLabel,
  };
}

function sanitizeEmails(emails) {
  if (!Array.isArray(emails)) {
    return [];
  }
  const seen = new Set();
  const result = [];
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const raw of emails) {
    if (typeof raw !== "string") {
      continue;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }
    const lowered = trimmed.toLowerCase();
    if (seen.has(lowered)) {
      continue;
    }
    if (!pattern.test(trimmed)) {
      continue;
    }
    seen.add(lowered);
    result.push(trimmed);
  }

  return result;
}

function getAllTags() {
  const tagSet = new Set();
  for (const sitemap of state.sitemaps) {
    const tags = sanitizeTags(sitemap.tags);
    for (const tag of tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet);
}

function formatRelativeTime(date) {
  if (typeof Intl === "undefined" || typeof Intl.RelativeTimeFormat !== "function") {
    return dateFormatter.format(date);
  }

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absMs = Math.abs(diffMs);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  let value;
  let unit;
  if (absMs < minute) {
    value = Math.round(diffMs / 1000);
    unit = "second";
  } else if (absMs < hour) {
    value = Math.round(diffMs / minute);
    unit = "minute";
  } else if (absMs < day) {
    value = Math.round(diffMs / hour);
    unit = "hour";
  } else if (absMs < week) {
    value = Math.round(diffMs / day);
    unit = "day";
  } else if (absMs < month) {
    value = Math.round(diffMs / week);
    unit = "week";
  } else if (absMs < year) {
    value = Math.round(diffMs / month);
    unit = "month";
  } else {
    value = Math.round(diffMs / year);
    unit = "year";
  }

  const rtf = new Intl.RelativeTimeFormat(getIntlLocale(currentLanguage), { numeric: "auto" });
  return rtf.format(value, unit);
}

function formatDateTime(isoString) {
  if (!isoString) {
    return t("datetime.unknown");
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return t("datetime.unknown");
  }

  if (typeof moment !== "undefined" && typeof moment === "function") {
    const m = moment(isoString);
    if (m.isValid()) {
      return m.fromNow();
    }
  }

  return formatRelativeTime(date);
}

function createStateEntry(raw) {
  if (!raw || typeof raw.url !== "string") {
    return null;
  }

  let normalizedUrl;
  try {
    normalizedUrl = new URL(raw.url.trim()).href;
  } catch (error) {
    return null;
  }

  const title =
    typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : normalizedUrl;

  const notificationsEnabled =
    typeof raw.notificationsEnabled === "boolean"
      ? raw.notificationsEnabled
      : typeof raw.notifications === "boolean"
      ? raw.notifications
      : false;

  const emailRecipients = sanitizeEmails(raw.emailRecipients);
  const emailEnabled = emailRecipients.length ? Boolean(raw.emailEnabled) : false;

  return {
    title,
    url: normalizedUrl,
    domain: extractDomain(normalizedUrl),
    tags: sanitizeTags(raw.tags),
    sourceType: normalizeSourceType(raw.sourceType || raw.type),
    notificationsEnabled,
    emailEnabled,
    emailRecipients,
  };
}

function getFallbackSitemaps() {
  return DEFAULT_SITEMAPS.map((item) => createStateEntry(item)).filter(Boolean);
}

async function fetchSitemapsFromServer() {
  const response = await fetch(API_ENDPOINT, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Beklenmeyen API yaniti alindi.");
  }
  return payload.map((item) => createStateEntry(item)).filter(Boolean);
}

async function syncSitemapsFromServer(resetOnFailure = false) {
  try {
    const fetched = await fetchSitemapsFromServer();
    state.sitemaps = fetched;
  } catch (error) {
    console.warn("Sitemap listesi API'dan alinamadi.", error);
    if (resetOnFailure) {
      state.sitemaps = getFallbackSitemaps();
    }
  }
}

function persistSitemaps(list) {
  const payload = list
    .map((item) => {
      if (!item || typeof item.url !== "string") {
        return null;
      }
      const title =
        typeof item.title === "string" && item.title.trim() ? item.title.trim() : item.url;
      return {
        title,
        url: item.url,
        sourceType: normalizeSourceType(item.sourceType),
        tags: sanitizeTags(item.tags),
        notificationsEnabled: Boolean(item.notificationsEnabled),
        emailEnabled: Boolean(item.emailEnabled) && sanitizeEmails(item.emailRecipients).length > 0,
        emailRecipients: sanitizeEmails(item.emailRecipients),
      };
    })
    .filter(Boolean);

  fetch(API_ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || `HTTP ${response.status}`);
        });
      }
      return null;
    })
    .catch((error) => {
      console.warn("Sitemap listesi kaydedilemedi.", error);
    });
}

const state = {
  sitemaps: getFallbackSitemaps(),
  rows: [],
  filter: "",
  alertsOnly: readAlertsOnlyPreference(),
  selectedDomain: null,
  selectedTag: null,
  selected: null,
  detailEntries: [],
  detailType: null,
  detailFilters: {
    from: "",
    to: "",
  },
  detailPrefixSummary: [],
  detailPrefixFilter: null,
  detailPrefixTotal: 0,
  detailIssueSummary: [],
  detailIssueFilter: null,
  detailIssueTotal: 0,
  detailHasMoreGroups: false,
  detailExpandedUrl: null,
  detailAccordionTabs: new Map(),
  detailCompare: [],
  detailComparePanelVisible: false,
  isLoadingDetails: false,
  editingUrl: null,
  tagInputUrl: null,
  chartDaysFilter: 7,
  detailSearchQuery: "",
  tablePage: 1,
  tablePerPage: readTablePerPagePreference() ?? 50,
  detailPage: 1,
  detailPerPage: 50,
  expandedRow: null,
  brevoSettings: {
    hasApiKey: false,
    senderEmail: "",
    senderName: "",
  },
  emailEditUrl: null,
  detailMetadata: new Map(),
  linkMapBySitemap: new Map(),
  linkMapLoading: new Set(),
  linkMapChecked: new Set(),
  linkMapJobsBySitemap: new Map(),
  linkMapPollersBySitemap: new Map(),
  detailScan: {
    status: "idle",
    runId: null,
    sitemapUrl: null,
    startedAt: null,
    totalCount: 0,
    metadataDone: 0,
    headingDone: 0,
    lastUrl: "",
    isPaused: false,
    stopRequested: false,
    lastCompletedAt: null,
    isSingle: false,
    stats: {
      count2xx: 0,
      count3xx: 0,
      count404: 0,
      count4xx: 0,
      count5xx: 0,
      countOther: 0,
      countTimeout: 0,
    },
  },
  discovery: {
    isLoading: false,
    results: [],
    lastQuery: "",
    domain: "",
    error: null,
  },
  notificationCenter: {
    items: [],
    unreadCount: 0,
    isOpen: false,
    loaded: false,
  },
};

let detailRowIdCounter = 0;
let detailScanProgressTimer = null;
let detailScanFlushInFlight = false;
const detailScanBuffer = {
  urlResults: [],
  headingLinks: [],
};
let detailScanRequestId = 0;
let detailRenderScheduled = false;
const detailMetadataRequests = new Map();
const notificationManager = (() => {
  const storageKey = NOTIFICATION_PREF_KEY;
  const intervalMs = NOTIFICATION_CHECK_INTERVAL;
  const supportsNotifications = typeof window !== "undefined" && "Notification" in window;
  let button = null;
  let enabled = false;
  let intervalId = null;
  let isChecking = false;
  let snapshot = new Map();

  function readPreference() {
    if (!supportsNotifications) {
      return false;
    }
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch (error) {
      return false;
    }
  }

  function writePreference(value) {
    if (!supportsNotifications) {
      return;
    }
    try {
      if (value) {
        localStorage.setItem(storageKey, "1");
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      // Storage not available, ignore silently.
    }
  }

  function updateButtonLabel() {
    if (!button) {
      return;
    }

    if (!supportsNotifications) {
      button.disabled = true;
      button.textContent = t("notifications.unsupported");
      button.title = t("notifications.unsupportedHint");
      button.setAttribute("aria-pressed", "false");
      return;
    }

    const permission = Notification.permission;
    if (permission === "denied") {
      button.disabled = true;
      button.textContent = t("notifications.blocked");
      button.title = t("notifications.blockedHint");
      button.setAttribute("aria-pressed", "false");
      return;
    }

    button.disabled = false;
    button.textContent = t(
      enabled ? "button.notification.disable" : "button.notification.enable"
    );
    button.title = t(
      enabled ? "notifications.toggle.disableTitle" : "notifications.toggle.enableTitle"
    );
    button.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function pushNotification(title, body, { tag } = {}) {
    if (!supportsNotifications || !enabled) {
      return;
    }
    try {
      new Notification(title, {
        body,
        tag: tag || `sitemapflow-${title}`,
      });
    } catch (error) {
      console.warn("Bildirim gonderilemedi:", error);
    }
  }

  function queueEmailNotification(entry, context) {
    if (
      !entry.emailEnabled ||
      !Array.isArray(entry.emailRecipients) ||
      !entry.emailRecipients.length
    ) {
      return;
    }

    const content = buildEmailContent(entry, context);
    if (!content) {
      return;
    }

    requestEmailSend({
      url: entry.url,
      subject: content.subject,
      htmlContent: content.html,
      textContent: content.text,
      isTest: false,
    }).catch((error) => {
      console.warn("E-posta bildirimi gonderilemedi:", error);
    });
  }

  function buildEmailContent(entry, context) {
    const title = entry.title || entry.url;
    const baseLink = `<p><strong>Sitemap:</strong> <a href="${entry.url}" target="_blank" rel="noopener noreferrer">${entry.url}</a></p>`;

    switch (context.type) {
      case "new": {
        const subject = `[SitemapFlow] Izleme Basladi: ${title}`;
        const text = `${title} sitemap'i izlenmeye baslandi.\nSitemap: ${entry.url}`;
        const html = `<p>${title} sitemap'i izlenmeye baslandi.</p>${baseLink}`;
        return { subject, text, html };
      }
      case "error": {
        const errorMessage = context.error || "Bilinmeyen hata";
        const subject = `[SitemapFlow] Hata: ${title}`;
        const text = `${title} sitemap'i icin hata olustu:\n${errorMessage}\nSitemap: ${entry.url}`;
        const html = `<p>${title} sitemap'i icin hata olustu:</p><pre>${errorMessage}</pre>${baseLink}`;
        return { subject, text, html };
      }
      case "recovered": {
        const subject = `[SitemapFlow] Cozuldu: ${title}`;
        const text = `${title} sitemap'i yeniden erisilebilir.\nSitemap: ${entry.url}`;
        const html = `<p>${title} sitemap'i yeniden erisilebilir.</p>${baseLink}`;
        return { subject, text, html };
      }
      case "update": {
        const details = [];
        const htmlDetails = [];
        if (context.latestChanged) {
          details.push(`Son guncelleme: ${entry.latestDate || "-"}`);
          htmlDetails.push(`<li><strong>Son guncelleme:</strong> ${entry.latestDate || "-"}</li>`);
        }
        if (context.countIncreased) {
          const previousCount = typeof context.previousCount === "number" ? context.previousCount : null;
          const currentCount = entry.totalEntries || 0;
          const formattedCurrent = numberFormatter.format(currentCount);
          const formattedPrevious = previousCount !== null ? numberFormatter.format(previousCount) : "-";
          details.push(`URL sayisi: ${formattedCurrent}${previousCount !== null ? ` (Once: ${formattedPrevious})` : ""}`);
          htmlDetails.push(
            `<li><strong>URL sayisi:</strong> ${formattedCurrent}${previousCount !== null ? ` (Once: ${formattedPrevious})` : ""}</li>`
          );
        }
        const addedLinksRaw = Array.isArray(context.addedLinks)
          ? context.addedLinks.filter((item) => item && item.href)
          : [];
        const updatedLinksRaw = Array.isArray(context.updatedLinks)
          ? context.updatedLinks.filter((item) => item && item.href)
          : [];
        const addedCount = typeof context.addedCount === "number" ? context.addedCount : addedLinksRaw.length;
        const updatedCount = typeof context.updatedCount === "number" ? context.updatedCount : updatedLinksRaw.length;
        const addedLinks = addedLinksRaw.slice(0, 5);
        const updatedLinks = updatedLinksRaw.slice(0, 5);

        if (addedCount) {
          details.push(`Yeni URL: ${numberFormatter.format(addedCount)} adet`);
          htmlDetails.push(`<li><strong>Yeni URL:</strong> ${numberFormatter.format(addedCount)} adet</li>`);
        }
        if (updatedCount) {
          details.push(`Guncellenen URL: ${numberFormatter.format(updatedCount)} adet`);
          htmlDetails.push(`<li><strong>Guncellenen URL:</strong> ${numberFormatter.format(updatedCount)} adet</li>`);
        }

        const formatLinkText = (item) => {
          const stamp = item.lastMod || (item.lastModIso ? formatDateTime(item.lastModIso) : null);
          return stamp ? `${item.href} (son mod: ${stamp})` : item.href;
        };

        const formatLinkHtml = (item) => {
          const stamp = item.lastMod || (item.lastModIso ? formatDateTime(item.lastModIso) : null);
          const label = stamp ? `${stamp}` : "";
          return `<li><a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.href}</a>${label ? ` <span style="color:#6b7280;">(${label})</span>` : ""}</li>`;
        };

        const textLinkSections = [];
        const htmlLinkSections = [];

        if (addedLinks.length) {
          const heading = addedCount > addedLinks.length ? `Yeni URL'ler (ilk ${addedLinks.length}):` : "Yeni URL'ler:";
          textLinkSections.push(`${heading}\n${addedLinks.map((item) => `+ ${formatLinkText(item)}`).join("\n")}`);
          htmlLinkSections.push(
            `<p><strong>${heading}</strong></p><ul>${addedLinks.map(formatLinkHtml).join("")}</ul>`
          );
        }

        if (updatedLinks.length) {
          const heading = updatedCount > updatedLinks.length
            ? `Guncellenen URL'ler (ilk ${updatedLinks.length}):`
            : "Guncellenen URL'ler:";
          textLinkSections.push(`${heading}\n${updatedLinks.map((item) => `Ã¢â‚¬Â¢ ${formatLinkText(item)}`).join("\n")}`);
          htmlLinkSections.push(
            `<p><strong>${heading}</strong></p><ul>${updatedLinks.map(formatLinkHtml).join("")}</ul>`
          );
        }

        const subject = `[SitemapFlow] Guncelleme: ${title}`;
        const textBody = details.length ? details.join("\n") : "Yeni icerik bulundu.";
        const extraLinksText = textLinkSections.length ? `\n\n${textLinkSections.join("\n\n")}` : "";
        const text = `${title} sitemap'i guncellendi.\n${textBody}${extraLinksText}\n\nSitemap: ${entry.url}`;
        const html =
          `<p>${title} sitemap'i guncellendi.</p>${htmlDetails.length ? `<ul>${htmlDetails.join("")}</ul>` : ""}${
            htmlLinkSections.length ? htmlLinkSections.join("") : ""
          }${baseLink}`;
        return { subject, text, html };
      }
      default:
        return null;
    }
  }

  function buildEntry(row) {
    return {
      url: row.url,
      title: row.title || row.url,
      totalEntries: row.totalEntries || 0,
      latestDateIso: row.latestDateIso || null,
      latestDate: row.latestDate || null,
      error: row.error || null,
      notificationsEnabled: Boolean(row.notificationsEnabled),
      emailEnabled:
        Boolean(row.emailEnabled) && Array.isArray(row.emailRecipients) && row.emailRecipients.length > 0,
      emailRecipients: sanitizeEmails(row.emailRecipients),
      recentEntries: Array.isArray(row.recentEntries)
        ? row.recentEntries
            .filter((item) => item && typeof item.href === "string" && item.href.trim())
            .map((item) => ({
              href: item.href.trim(),
              lastModIso: item.lastModIso || null,
              lastMod: item.lastMod || null,
            }))
        : [],
    };
  }

  function processRows(rows, { notify } = { notify: false }) {
    const canUsePush = supportsNotifications && enabled;
    const formatted = rows.map(buildEntry);
    const nextSnapshot = new Map();
    const suppressInitial = !snapshot.size && notify;

    formatted.forEach((entry) => {
      const wantPush = canUsePush && Boolean(entry.notificationsEnabled);
      const wantEmail =
        entry.emailEnabled && Array.isArray(entry.emailRecipients) && entry.emailRecipients.length > 0;

      if (!wantPush && !wantEmail) {
        return;
      }

      nextSnapshot.set(entry.url, entry);

      if (suppressInitial || !notify) {
        return;
      }

      const previous = snapshot.get(entry.url);

      if (!previous) {
        if (!entry.error) {
          if (wantPush) {
            pushNotification(`${entry.title} izlemeye eklendi`, "Yeni sitemap izlemeye basladi.");
          }
          if (wantEmail) {
            queueEmailNotification(entry, { type: "new" });
          }
        }
        return;
      }

      if (entry.error) {
        if (!previous.error) {
          if (wantPush) {
            pushNotification(`${entry.title} hata veriyor`, entry.error);
          }
          if (wantEmail) {
            queueEmailNotification(entry, { type: "error", error: entry.error });
          }
        }
        return;
      }

      if (previous.error && !entry.error) {
        if (wantPush) {
          pushNotification(
            `${entry.title} tekrar erisilebilir`,
            "Sitemap istegi yeniden basarili oldu."
          );
        }
        if (wantEmail) {
          queueEmailNotification(entry, { type: "recovered" });
        }
      }

      const latestChanged =
        entry.latestDateIso && entry.latestDateIso !== (previous.latestDateIso || null);
      const countIncreased = entry.totalEntries > (previous.totalEntries || 0);

      if (latestChanged || countIncreased) {
        const parts = [];
        if (latestChanged) {
          parts.push(`Son guncelleme: ${entry.latestDate || "-"}`);
        }
        if (countIncreased) {
          parts.push(`URL sayisi: ${numberFormatter.format(entry.totalEntries)}`);
        }
        const previousRecent = Array.isArray(previous.recentEntries) ? previous.recentEntries : [];
        const currentRecent = Array.isArray(entry.recentEntries) ? entry.recentEntries : [];
        const previousRecentMap = new Map(
          previousRecent
            .filter((item) => item && typeof item.href === "string")
            .map((item) => [item.href, item.lastModIso || item.lastMod || null])
        );
        const addedLinks = [];
        const updatedLinks = [];
        for (const item of currentRecent) {
          if (!item || typeof item.href !== "string") {
            continue;
          }
          const href = item.href;
          const previousStamp = previousRecentMap.has(href) ? previousRecentMap.get(href) : undefined;
          if (previousStamp === undefined) {
            addedLinks.push(item);
            continue;
          }
          const currentStamp = item.lastModIso || item.lastMod || null;
          if (currentStamp && previousStamp && currentStamp !== previousStamp) {
            updatedLinks.push(item);
          }
        }
        const addedCount = addedLinks.length;
        const updatedCount = updatedLinks.length;
        if (addedCount) {
          parts.push(`Yeni URL: ${numberFormatter.format(addedCount)} adet`);
        }
        if (updatedCount) {
          parts.push(`Guncellenen URL: ${numberFormatter.format(updatedCount)} adet`);
        }
        const body = parts.join("\n") || "Yeni icerik bulundu.";
        if (wantPush) {
          pushNotification(`${entry.title} guncellendi`, body);
        }
        if (wantEmail) {
          queueEmailNotification(entry, {
            type: "update",
            latestChanged,
            countIncreased,
            previousCount: previous.totalEntries || 0,
            addedLinks: addedLinks.slice(0, 5),
            addedCount,
            updatedLinks: updatedLinks.slice(0, 5),
            updatedCount,
          });
        }
      }
    });

    snapshot = nextSnapshot;
  }

  async function checkForUpdates() {
    if (isChecking) {
      return;
    }

    if (!state.sitemaps || !state.sitemaps.length) {
      snapshot = new Map();
      return;
    }

    const canUsePush = supportsNotifications && enabled;

    const targets = state.sitemaps
      .map((config) => {
        const notificationsEnabled = Boolean(config.notificationsEnabled) && canUsePush;
        const emailRecipients = sanitizeEmails(config.emailRecipients);
        const emailEnabled = emailRecipients.length ? Boolean(config.emailEnabled) : false;
        return {
          ...config,
          notificationsEnabled,
          emailEnabled,
          emailRecipients,
          shouldTrack: notificationsEnabled || emailEnabled,
        };
      })
      .filter((item) => item.shouldTrack);

    if (!targets.length) {
      snapshot = new Map();
      return;
    }

    isChecking = true;
    try {
      const rows = await Promise.all(
        targets.map(async (config) => {
          const title =
            config.title && config.title.trim() ? config.title.trim() : config.url;
          try {
            const xmlText = await fetchSitemapText(config.url);
            const doc = parseXml(xmlText);
            const type = doc.documentElement.nodeName.toLowerCase();
            const summary = buildSummary(doc, type);
            return {
              title,
              url: config.url,
              totalEntries: summary.count,
              latestDateIso: summary.latestDateIso,
              latestDate: summary.latestDate,
              error: null,
              errorType: null,
              errorCode: null,
              notificationsEnabled: config.notificationsEnabled,
              emailEnabled: config.emailEnabled,
              emailRecipients: config.emailRecipients,
            };
          } catch (error) {
            return {
              title,
              url: config.url,
              totalEntries: 0,
              latestDateIso: null,
              latestDate: null,
              error: error.message || "Bilinmeyen hata",
              errorType: error && error.fetchErrorType ? error.fetchErrorType : null,
              errorCode: error && error.fetchErrorCode ? error.fetchErrorCode : null,
              notificationsEnabled: config.notificationsEnabled,
              emailEnabled: config.emailEnabled,
              emailRecipients: config.emailRecipients,
            };
          }
        })
      );

      processRows(rows, { notify: true });
    } catch (error) {
      console.warn("Bildirim kontrolu sirasinda hata olustu:", error);
    } finally {
      isChecking = false;
    }
  }

  function clearTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startTimer() {
    clearTimer();
    intervalId = setInterval(checkForUpdates, intervalMs);
    checkForUpdates();
  }

  function ensurePolling() {
    if (!intervalId) {
      startTimer();
    }
  }

  function setEnabled(value) {
    if (!supportsNotifications) {
      return;
    }
    if (enabled === value) {
      return;
    }
    enabled = value;

    if (enabled) {
      writePreference(true);
      startTimer();
    } else {
      writePreference(false);
      clearTimer();
    }

    updateButtonLabel();
  }

  async function enableNotifications({ silent = false } = {}) {
    if (!supportsNotifications) {
      if (!silent) {
        setStatus("Tarayici bildirimleri bu ortamda desteklenmiyor.");
      }
      return { ok: false, reason: "unsupported" };
    }

    if (enabled && Notification.permission === "granted") {
      return { ok: true, changed: false };
    }

    let permission = Notification.permission;
    if (permission === "denied") {
      if (!silent) {
        setStatus("Tarayici bildirim izni engellenmis. Lutfen tarayici ayarlarinizi kontrol edin.");
      }
      updateButtonLabel();
      return { ok: false, reason: "denied" };
    }

    if (permission === "default") {
      try {
        permission = await Notification.requestPermission();
      } catch (error) {
        console.warn("Bildirim izni istenirken hata olustu:", error);
        if (!silent) {
        setStatus(t("notifications.error.generic"), "error");
        }
        updateButtonLabel();
        return { ok: false, reason: "error" };
      }
    }

    if (permission !== "granted") {
      if (!silent) {
        setStatus(t("notifications.error.denied"), "error");
      }
      updateButtonLabel();
      return { ok: false, reason: "denied" };
    }

    if (state.rows && state.rows.length) {
      processRows(state.rows, { notify: false });
    }

    const wasEnabled = enabled;
    setEnabled(true);

    if (!silent) {
      setStatus(t("notifications.enabled"), "success");
    }

    return { ok: true, changed: !wasEnabled };
  }

  function disableNotifications({ silent = false } = {}) {
    if (!supportsNotifications) {
      if (!silent) {
        setStatus(t("notifications.unsupported"), "error");
      }
      return { ok: false, reason: "unsupported" };
    }

    if (!enabled) {
      return { ok: true, changed: false };
    }

    setEnabled(false);
    if (!silent) {
      setStatus(t("notifications.disabled"), "info");
    }
    return { ok: true, changed: true };
  }

  async function ensureActive(options = {}) {
    if (!supportsNotifications) {
      if (!options.silent) {
        setStatus("Tarayici bildirimleri bu ortamda desteklenmiyor.");
      }
      return { ok: false, reason: "unsupported" };
    }

    if (enabled && Notification.permission === "granted") {
      return { ok: true, changed: false };
    }

    return enableNotifications(options);
  }

  function isSupported() {
    return supportsNotifications;
  }

  function isEnabled() {
    return supportsNotifications && enabled && Notification.permission === "granted";
  }

  function triggerTest(entry, { silent = false } = {}) {
    if (!supportsNotifications) {
      if (!silent) {
        setStatus("Tarayici bildirimleri bu ortamda desteklenmiyor.");
      }
      return false;
    }

    if (!enabled || Notification.permission !== "granted") {
      if (!silent) {
        setStatus("Once genel bildirimleri etkinlestirin.");
      }
      return false;
    }

    if (!entry) {
      if (!silent) {
        setStatus("Bildirim gonderilecek sitemap bulunamadi.");
      }
      return false;
    }

    try {
      pushNotification(`${entry.title} (test)`, "Bu bir test bildirimi.", {
        tag: `sitemapflow-test-${entry.url}`,
      });
      return true;
    } catch (error) {
      console.warn("Test bildirimi gonderilemedi:", error);
      if (!silent) {
        setStatus("Test bildirimi gonderilemedi.");
      }
      return false;
    }
  }

  async function handleButtonClick() {
    if (enabled) {
      disableNotifications({ silent: false });
      return;
    }

    await enableNotifications({ silent: false });
  }

  function initialize(buttonElement) {
    button = buttonElement;

    if (button) {
      button.addEventListener("click", handleButtonClick);
    }

    if (!supportsNotifications) {
      updateButtonLabel();
      return;
    }

    const shouldEnable = readPreference() && Notification.permission === "granted";
    if (shouldEnable) {
      enabled = true;
    }

    updateButtonLabel();

    if (enabled) {
      startTimer();
    }
  }

  function record(rows) {
    if (!rows || !rows.length) {
      snapshot = new Map();
      return;
    }
    processRows(rows, { notify: false });
  }

  function reset() {
    snapshot = new Map();
  }

  return {
    initialize,
    record,
    reset,
    enableNotifications,
    disableNotifications,
    ensureActive,
    isSupported,
    isEnabled,
    triggerTest,
    ensurePolling,
  };
})();

const scanNotificationCenter = (() => {
  const limit = 25;
  let pollerId = null;
  let isLoading = false;

  function severityClass(severity) {
    const safe = String(severity || "").toLowerCase();
    if (safe === "high") {
      return "high";
    }
    if (safe === "medium") {
      return "medium";
    }
    return "low";
  }

  function severityLabel(severity) {
    const safe = severityClass(severity);
    return t(`notification.center.severity.${safe}`);
  }

  function formatRelativeTime(value) {
    if (!value) {
      return t("notification.center.relative.now");
    }
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) {
      return t("notification.center.relative.now");
    }
    if (typeof moment !== "undefined" && typeof moment === "function") {
      return moment(timestamp).fromNow();
    }
    const diffMs = Date.now() - timestamp;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin <= 0) {
      return t("notification.center.relative.now");
    }
    if (diffMin < 60) {
      return `${diffMin}m`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      return `${diffHour}h`;
    }
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d`;
  }

  function normalizeNotification(item) {
    if (!item || typeof item !== "object") {
      return null;
    }
    const parsedId = Number(item.id);
    if (!Number.isFinite(parsedId)) {
      return null;
    }
    return {
      id: parsedId,
      sitemapUrl: typeof item.sitemapUrl === "string" ? item.sitemapUrl : "",
      runId: Number.isFinite(Number(item.runId)) ? Number(item.runId) : null,
      diffId: Number.isFinite(Number(item.diffId)) ? Number(item.diffId) : null,
      type: typeof item.type === "string" ? item.type : "",
      severity: severityClass(item.severity),
      title: item.title || "",
      message: item.message || "",
      payload: item.payload && typeof item.payload === "object" ? item.payload : null,
      isRead: Boolean(item.isRead),
      createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
      readAt: typeof item.readAt === "string" ? item.readAt : null,
    };
  }

  function setPanelOpen(open) {
    if (!scanNotificationPanel || !scanNotificationBell) {
      return;
    }
    const isOpen = Boolean(open);
    state.notificationCenter.isOpen = isOpen;
    scanNotificationPanel.hidden = !isOpen;
    scanNotificationBell.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function updateBadge() {
    if (!scanNotificationBadge) {
      return;
    }
    const unreadCount = Number(state.notificationCenter.unreadCount) || 0;
    if (unreadCount > 0) {
      scanNotificationBadge.hidden = false;
      scanNotificationBadge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
    } else {
      scanNotificationBadge.hidden = true;
      scanNotificationBadge.textContent = "0";
    }
  }

  function updateReadAllButton() {
    if (!scanNotificationReadAll) {
      return;
    }
    scanNotificationReadAll.disabled = (Number(state.notificationCenter.unreadCount) || 0) === 0;
  }

  function renderList() {
    if (!scanNotificationList || !scanNotificationEmpty) {
      return;
    }
    const items = Array.isArray(state.notificationCenter.items) ? state.notificationCenter.items : [];
    scanNotificationList.innerHTML = "";
    if (!items.length) {
      scanNotificationEmpty.hidden = false;
      updateReadAllButton();
      updateBadge();
      return;
    }

    scanNotificationEmpty.hidden = true;
    items.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("notification-center__item");
      if (!item.isRead) {
        li.classList.add("notification-center__item--unread");
      }
      li.dataset.notificationId = String(item.id);

      const meta = document.createElement("div");
      meta.classList.add("notification-center__meta");
      const sev = document.createElement("span");
      sev.classList.add("notification-center__severity", `notification-center__severity--${item.severity}`);
      sev.textContent = severityLabel(item.severity);
      const time = document.createElement("span");
      time.classList.add("notification-center__time");
      time.textContent = formatRelativeTime(item.createdAt);
      meta.append(sev, time);

      const title = document.createElement("p");
      title.classList.add("notification-center__item-title");
      title.textContent = item.title || "-";

      const message = document.createElement("p");
      message.classList.add("notification-center__item-message");
      message.textContent = item.message || "-";

      li.append(meta, title, message);
      scanNotificationList.appendChild(li);
    });
    updateReadAllButton();
    updateBadge();
  }

  async function markAsRead(id) {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      return false;
    }
    const response = await fetch(`${API_SCAN_NOTIFICATIONS_ENDPOINT}/${encodeURIComponent(parsedId)}/read`, {
      method: "POST",
    });
    if (!response.ok) {
      return false;
    }
    state.notificationCenter.items = (state.notificationCenter.items || []).map((item) => {
      if (!item || item.id !== parsedId) {
        return item;
      }
      return { ...item, isRead: true };
    });
    state.notificationCenter.unreadCount = state.notificationCenter.items.filter((item) => item && !item.isRead).length;
    renderList();
    return true;
  }

  async function markAllRead() {
    const response = await fetch(API_SCAN_NOTIFICATIONS_READ_ALL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      return false;
    }
    state.notificationCenter.items = (state.notificationCenter.items || []).map((item) =>
      item ? { ...item, isRead: true } : item
    );
    state.notificationCenter.unreadCount = 0;
    renderList();
    return true;
  }

  async function refreshNow({ silent = false } = {}) {
    if (isLoading) {
      return;
    }
    isLoading = true;
    try {
      const response = await fetch(
        `${API_SCAN_NOTIFICATIONS_ENDPOINT}?limit=${encodeURIComponent(limit)}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json().catch(() => []);
      const nextItems = (Array.isArray(payload) ? payload : [])
        .map(normalizeNotification)
        .filter(Boolean);
      const previousUnread = new Set(
        (state.notificationCenter.items || [])
          .filter((item) => item && !item.isRead)
          .map((item) => item.id)
      );
      state.notificationCenter.items = nextItems;
      state.notificationCenter.unreadCount = nextItems.filter((item) => !item.isRead).length;
      renderList();

      if (state.notificationCenter.loaded && !state.notificationCenter.isOpen) {
        const newUnread = nextItems.filter((item) => !item.isRead && !previousUnread.has(item.id));
        if (newUnread.length) {
          showToast(newUnread[0].message || newUnread[0].title, "info");
        }
      }
      state.notificationCenter.loaded = true;
    } catch (error) {
      if (!silent) {
        console.warn("Scan notifications could not be loaded:", error);
      }
    } finally {
      isLoading = false;
    }
  }

  function handleItemClick(event) {
    const row = event.target instanceof Element
      ? event.target.closest(".notification-center__item")
      : null;
    if (!row) {
      return;
    }
    const notificationId = Number(row.dataset.notificationId);
    const item = (state.notificationCenter.items || []).find((entry) => entry && entry.id === notificationId);
    if (!item) {
      return;
    }
    markAsRead(notificationId).catch(() => undefined);
    if (item.sitemapUrl) {
      const targetRow = state.rows.find((entry) => entry && entry.url === item.sitemapUrl);
      if (targetRow) {
        showDetails(targetRow);
      }
    }
    setPanelOpen(false);
  }

  function startPolling() {
    if (pollerId) {
      clearInterval(pollerId);
      pollerId = null;
    }
    pollerId = setInterval(() => {
      refreshNow({ silent: true });
    }, NOTIFICATION_CENTER_POLL_MS);
  }

  function reset() {
    state.notificationCenter.items = [];
    state.notificationCenter.unreadCount = 0;
    state.notificationCenter.loaded = false;
    renderList();
  }

  function initialize() {
    if (
      !scanNotificationCenterElement ||
      !scanNotificationBell ||
      !scanNotificationPanel ||
      !scanNotificationList
    ) {
      return;
    }
    scanNotificationBell.addEventListener("click", () => {
      const next = !state.notificationCenter.isOpen;
      setPanelOpen(next);
      if (next) {
        refreshNow({ silent: true });
      }
    });
    if (scanNotificationClose) {
      scanNotificationClose.addEventListener("click", () => {
        setPanelOpen(false);
      });
    }
    if (scanNotificationReadAll) {
      scanNotificationReadAll.addEventListener("click", async () => {
        const ok = await markAllRead();
        if (ok) {
          setStatus(t("notification.center.readAll"), "success");
        }
      });
    }
    scanNotificationList.addEventListener("click", handleItemClick);
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (!state.notificationCenter.isOpen) {
        return;
      }
      if (!scanNotificationCenterElement.contains(target)) {
        setPanelOpen(false);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.notificationCenter.isOpen) {
        setPanelOpen(false);
      }
    });
    renderList();
    refreshNow({ silent: true });
    startPolling();
  }

  return {
    initialize,
    refreshNow,
    reset,
  };
})();

const brevoManager = (() => {
  let form = null;
  let apiKeyInput = null;
  let senderNameInput = null;
  let senderEmailInput = null;
  let statusElement = null;
  let testButton = null;
  let isSaving = false;
  let isTesting = false;

  function setStatusMessage(message, isError = false) {
    if (!statusElement) {
      return;
    }
    statusElement.textContent = message || "";
    statusElement.classList.toggle("settings-card__status--error", Boolean(isError));
  }

  function populateForm() {
    if (!form) {
      return;
    }
    if (apiKeyInput) {
      apiKeyInput.value = "";
    }
    if (senderNameInput) {
      senderNameInput.value = state.brevoSettings?.senderName || "";
    }
    if (senderEmailInput) {
      senderEmailInput.value = state.brevoSettings?.senderEmail || "";
    }
    setStatusMessage(
      state.brevoSettings?.hasApiKey
        ? "Kayitli bir API anahtariniz var. Degistirmek istemiyorsaniz bos birakin."
        : "Henuz API anahtari tanimli degil.",
      false
    );
  }

  async function loadSettings() {
    try {
      const response = await fetch(API_BREVO_SETTINGS_ENDPOINT, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      state.brevoSettings = {
        hasApiKey: Boolean(data.hasApiKey),
        senderEmail: data.senderEmail || "",
        senderName: data.senderName || "",
      };
      populateForm();
    } catch (error) {
      console.warn("Brevo ayarlari yuklenemedi:", error);
      setStatusMessage("Brevo ayarlari yuklenemedi. LÃƒÂ¼tfen tekrar deneyin.", true);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSaving || !form) {
      return;
    }

    const payload = {};
    if (apiKeyInput) {
      const raw = apiKeyInput.value;
      if (raw && raw.trim()) {
        payload.apiKey = raw.trim();
      } else {
        payload.apiKey = null;
      }
    }
    if (senderNameInput) {
      payload.senderName = senderNameInput.value.trim();
    }
    if (senderEmailInput) {
      payload.senderEmail = senderEmailInput.value.trim();
    }

    try {
      isSaving = true;
      setStatusMessage("Kaydediliyor...", false);

      const response = await fetch(API_BREVO_SETTINGS_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `HTTP ${response.status}`);
      }

      const data = await response.json();
      state.brevoSettings = {
        hasApiKey: Boolean(data.hasApiKey),
        senderEmail: data.senderEmail || "",
        senderName: data.senderName || "",
      };
      populateForm();
      setStatusMessage("Ayarlar kaydedildi.", false);
    } catch (error) {
      console.warn("Brevo ayarlari kaydedilemedi:", error);
      setStatusMessage(
        error.message || "Brevo ayarlari kaydedilemedi. Bilgileri kontrol edin.",
        true
      );
    } finally {
      isSaving = false;
    }
  }

  async function handleTest(event) {
    if (event) {
      event.preventDefault();
    }
    if (isTesting) {
      return;
    }

    const payload = {};
    const rawKey = apiKeyInput ? apiKeyInput.value.trim() : "";
    if (rawKey) {
      payload.apiKey = rawKey;
    } else if (!state.brevoSettings?.hasApiKey) {
      setStatusMessage("Once API anahtari kaydedin ve tekrar deneyin.", true);
      return;
    }

    try {
      isTesting = true;
      if (testButton) {
        testButton.disabled = true;
      }
      setStatusMessage("API anahtari test ediliyor...", false);

      const response = await fetch(API_BREVO_SETTINGS_TEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data?.message || `Test basarisiz oldu (HTTP ${response.status}).`;
        throw new Error(message);
      }

      const account = data?.account || {};
      const identity =
        account.companyName ||
        account.firstName ||
        account.email ||
        (data?.usingStoredKey ? "Kayitli Brevo hesabi" : "Brevo hesabi");

      const extraHint = rawKey
        ? " Degisikligi kalici yapmak icin Kaydet tusuna basin."
        : "";

      setStatusMessage(`${identity} icin API anahtari dogrulandi.${extraHint}`, false);
    } catch (error) {
      setStatusMessage(error.message || "API anahtari test edilemedi.", true);
    } finally {
      isTesting = false;
      if (testButton) {
        testButton.disabled = false;
      }
    }
  }

  function initialize({
    formElement,
    apiKeyInputElement,
    senderNameInputElement,
    senderEmailInputElement,
    statusEl,
    testButtonElement,
  }) {
    form = formElement || null;
    apiKeyInput = apiKeyInputElement || null;
    senderNameInput = senderNameInputElement || null;
    senderEmailInput = senderEmailInputElement || null;
    statusElement = statusEl || null;
    testButton = testButtonElement || null;

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }

    if (testButton) {
      testButton.addEventListener("click", handleTest);
    }

    populateForm();
  }

  return {
    initialize,
    loadSettings,
    populateForm,
  };
})();
function ensureSettingsNavButton() {
  const sidebarNav = document.querySelector(".sidebar__nav");
  if (!sidebarNav) {
    return null;
  }

  let button = document.querySelector("#settingsNav");

  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.id = "settingsNav";
    button.classList.add("sidebar__link");

    const icon = document.createElement("iconify-icon");
    icon.setAttribute("icon", "mdi:cog-outline");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = "Ayarlar";

    button.append(icon, label);

    const logoutButton = document.querySelector("#logoutButton");
    sidebarNav.insertBefore(button, logoutButton || null);
  }

  button.classList.remove("sidebar__link--disabled");
  button.removeAttribute("disabled");

  let icon = button.querySelector("iconify-icon");
  if (!icon) {
    icon = document.createElement("iconify-icon");
    button.prepend(icon);
  }
  icon.setAttribute("icon", "mdi:cog-outline");
  icon.setAttribute("width", "20");
  icon.setAttribute("height", "20");
  icon.setAttribute("aria-hidden", "true");

  let label = button.querySelector("span");
  if (!label) {
    label = document.createElement("span");
    button.appendChild(label);
  }
  label.textContent = "Ayarlar";

  return button;
}

const tableBody = document.querySelector("#sitemapTable tbody");
const searchInput = document.querySelector("#searchInput");
const statusBox = document.querySelector("#status");
const refreshButton = document.querySelector("#refreshButton");
const notificationButton = document.querySelector("#notificationButton");
const scanNotificationCenterElement = document.querySelector("#scanNotificationCenter");
const scanNotificationBell = document.querySelector("#scanNotificationBell");
const scanNotificationBadge = document.querySelector("#scanNotificationBadge");
const scanNotificationPanel = document.querySelector("#scanNotificationPanel");
const scanNotificationList = document.querySelector("#scanNotificationList");
const scanNotificationEmpty = document.querySelector("#scanNotificationEmpty");
const scanNotificationReadAll = document.querySelector("#scanNotificationReadAll");
const scanNotificationClose = document.querySelector("#scanNotificationClose");
const exportSitemapsCsv = document.querySelector("#exportSitemapsCsv");
const exportSitemapsJson = document.querySelector("#exportSitemapsJson");
const alertsOnlyToggle = document.querySelector("#alertsOnlyToggle");
const dashboardNavButton = document.querySelector("#dashboardNav");
const settingsNavButton = ensureSettingsNavButton();
const pageHeaderTitle = document.querySelector(".page__header h1");
const dashboardPage = document.querySelector("#dashboardPage");
const settingsPage = document.querySelector("#settingsPage");
const brevoSettingsForm = document.querySelector("#brevoSettingsForm");
const brevoApiKeyInput = document.querySelector("#brevoApiKeyInput");
const brevoSenderNameInput = document.querySelector("#brevoSenderNameInput");
const brevoSenderEmailInput = document.querySelector("#brevoSenderEmailInput");
const brevoStatusElement = document.querySelector("#brevoStatus");
const brevoTestButton = document.querySelector("#brevoTestButton");
const domainFilter = document.querySelector("#domainFilter");
const tagFilter = document.querySelector("#tagFilter");
const urlCountHeader = document.querySelector("[data-role='count-header']");
const toastContainer = document.querySelector("#toastContainer");

function setActiveNav(target) {
  const navButtons = [dashboardNavButton, settingsNavButton].filter(Boolean);
  navButtons.forEach((button) => {
    if (button === target) {
      button.classList.add("sidebar__link--active");
      button.setAttribute("aria-current", "page");
    } else {
      button.classList.remove("sidebar__link--active");
      button.removeAttribute("aria-current");
    }
  });
}

function showDashboardView() {
  if (dashboardPage) {
    dashboardPage.style.display = "";
    dashboardPage.removeAttribute("hidden");
  }
  if (settingsPage) {
    settingsPage.style.display = "none";
    settingsPage.setAttribute("hidden", "");
  }
  if (detailsPanel) {
    detailsPanel.style.display = "";
  }
  setActiveNav(dashboardNavButton);
  if (pageHeaderTitle) {
    pageHeaderTitle.textContent = "Dashboard";
  }
}

function showSettingsView() {
  if (dashboardPage) {
    dashboardPage.style.display = "none";
    dashboardPage.setAttribute("hidden", "");
  }
  if (settingsPage) {
    settingsPage.style.display = "flex";
    settingsPage.removeAttribute("hidden");
  }
  if (detailsPanel) {
    detailsPanel.style.display = "none";
  }
  setActiveNav(settingsNavButton);
  if (pageHeaderTitle) {
    pageHeaderTitle.textContent = "Ayarlar";
  }
  brevoManager.populateForm();
}

const detailsTitle = document.querySelector("#detailsTitle");
const detailsStatus = document.querySelector("#detailsStatus");
const detailsTableBody = document.querySelector("#detailsTable tbody");
const detailsLinkHeader = document.querySelector("[data-role='details-link']");
const detailsDateHeader = document.querySelector("[data-role='details-date']");
const detailsExportButton = document.querySelector("#detailsExportButton");
const detailsScanButton = document.querySelector("#detailsScanButton");
const detailsPauseButton = document.querySelector("#detailsPauseButton");
const detailsStopButton = document.querySelector("#detailsStopButton");
const detailsFetchNote = document.querySelector("#detailsFetchNote");
const detailsTabs = document.querySelectorAll("[data-role=\"details-tab\"]");
const detailsUrlPanel = document.querySelector("#detailsUrlPanel");
const detailsCompareModal = document.querySelector("#detailsCompareModal");
const detailsCompareModalContent = document.querySelector("#detailsCompareModalContent");
const detailsCompareCards = document.querySelector("#detailsCompareCards");
const detailsCompareSummary = document.querySelector("#detailsCompareSummary");
const detailsCompareClear = document.querySelector("#detailsCompareClear");
const detailsCompareClose = document.querySelector("#detailsCompareClose");
const detailsCompareBar = document.querySelector("#detailsCompareBar");
const detailsCompareBarList = document.querySelector("#detailsCompareBarList");
const detailsCompareBarButton = document.querySelector("#detailsCompareBarButton");
const detailsDiscoveryPanel = document.querySelector("#detailsDiscoveryPanel");
const detailsDiscoveryStatus = document.querySelector("#detailsDiscoveryStatus");
const detailsDiscoveryControls = document.querySelector("#detailsDiscoveryControls");
const detailsIssueSection = document.querySelector("#detailsIssueSection");
const detailsIssueFilter = document.querySelector("#detailsIssueFilter");
const dateFromInput = document.querySelector("#dateFrom");
const dateToInput = document.querySelector("#dateTo");
const detailsPrefixFilter = document.querySelector("#detailsPrefixFilter");
const detailsPrefixMore = document.querySelector("#detailsPrefixMore");
const detailsPrefixPopover = document.querySelector("#detailsPrefixPopover");
const detailsPrefixMoreContainer = detailsPrefixMore
  ? detailsPrefixMore.closest(".details-groups__more")
  : null;
const mainPageElement = document.querySelector(".page");
const detailsPanel = document.querySelector("#detailsPanel");
const detailSearchInput = document.querySelector("#detailSearchInput");
const detailsPagination = document.querySelector("#detailsPagination");
const detailsPrevPage = document.querySelector("#detailsPrevPage");
const detailsNextPage = document.querySelector("#detailsNextPage");
const detailsPaginationInfo = document.querySelector("#detailsPaginationInfo");
const tablePagination = document.querySelector("#tablePagination");
const tablePrevPage = document.querySelector("#tablePrevPage");
const tableNextPage = document.querySelector("#tableNextPage");
const tablePaginationInfo = document.querySelector("#tablePaginationInfo");
const tablePerPageSelect = document.querySelector("#tablePerPageSelect");

function enforceBalancedLayout() {
  if (!mainPageElement || !detailsPanel) {
    return;
  }

  const isWide = window.matchMedia("(min-width: 1024px)").matches;
  if (isWide) {
    mainPageElement.style.flex = "1 1 50%";
    mainPageElement.style.minWidth = "0";
    detailsPanel.style.flex = "1 1 50%";
    detailsPanel.style.minWidth = "0";
  } else {
    mainPageElement.style.flex = "";
    mainPageElement.style.minWidth = "";
    detailsPanel.style.flex = "";
    detailsPanel.style.minWidth = "";
  }
}

window.addEventListener("resize", enforceBalancedLayout);
enforceBalancedLayout();

const addForm = document.querySelector("#addForm");
const addTitleInput = document.querySelector("#addTitle");
const addUrlInput = document.querySelector("#addUrl");
const addFeedForm = document.querySelector("#addFeedForm");
const addFeedTitleInput = document.querySelector("#addFeedTitle");
const addFeedUrlInput = document.querySelector("#addFeedUrl");
const adderTabButtons = document.querySelectorAll("[data-role='adder-tab']");
const adderTabPanels = document.querySelectorAll("[data-role='adder-panel']");
const discoverForm = document.querySelector("#discoverForm");
const discoverInput = document.querySelector("#discoverInput");
const discoverStatusElement = document.querySelector("#discoverStatus");
const discoverListElement = document.querySelector("#discoverList");
const discoverSubmitButton = document.querySelector("#discoverSubmit");
const discoverAddSelectedButton = document.querySelector("#discoverAddSelected");
const discoverClearButton = document.querySelector("#discoverClear");
const discoverActions = document.querySelector("#discoverActions");

notificationManager.initialize(notificationButton);
scanNotificationCenter.initialize();
if (exportSitemapsCsv) {
  exportSitemapsCsv.addEventListener("click", () => handleSitemapsExport("csv"));
}
if (exportSitemapsJson) {
  exportSitemapsJson.addEventListener("click", () => handleSitemapsExport("json"));
}
brevoManager.initialize({
  formElement: brevoSettingsForm,
  apiKeyInputElement: brevoApiKeyInput,
  senderNameInputElement: brevoSenderNameInput,
  senderEmailInputElement: brevoSenderEmailInput,
  statusEl: brevoStatusElement,
  testButtonElement: brevoTestButton,
});

if (dashboardNavButton) {
  dashboardNavButton.addEventListener("click", () => {
    showDashboardView();
  });
}

if (settingsNavButton) {
settingsNavButton.addEventListener("click", () => {
    showSettingsView();
    brevoManager.loadSettings();
  });
}

if (detailsExportButton) {
  detailsExportButton.addEventListener("click", handleDetailsExportClick);
}

if (detailsScanButton) {
  detailsScanButton.addEventListener("click", handleDetailsScanClick);
}

if (detailsPauseButton) {
  detailsPauseButton.addEventListener("click", handleDetailsPauseClick);
}

if (detailsStopButton) {
  detailsStopButton.addEventListener("click", handleDetailsStopClick);
}

if (detailsTabs && detailsTabs.length) {
  detailsTabs.forEach((button) => {
    button.addEventListener("click", handleDetailsTabClick);
  });
}
showDashboardView();

refreshButton.addEventListener("click", async () => {
  try {
    await syncSitemapsFromServer();
    await loadSitemaps();
  } catch (error) {
    handleLoadError(error);
  }
});

const handleSearchInput = debounce((value) => {
  state.filter = String(value || "").trim().toLowerCase();
  state.tablePage = 1;
  state.editingUrl = null;
  state.tagInputUrl = null;
  renderTable();
});
searchInput.addEventListener("input", (event) => {
  handleSearchInput(event.target.value);
});

if (alertsOnlyToggle) {
  alertsOnlyToggle.checked = Boolean(state.alertsOnly);
  alertsOnlyToggle.addEventListener("change", (event) => {
    state.alertsOnly = Boolean(event.target.checked);
    state.tablePage = 1;
    writeAlertsOnlyPreference(state.alertsOnly);
    renderDomainMenu();
    renderTagMenu();
    renderTable();
  });
}

if (tablePerPageSelect) {
  tablePerPageSelect.value = String(state.tablePerPage);
  tablePerPageSelect.addEventListener("change", (event) => {
    const nextValue = Number(event.target.value);
    if (!TABLE_PER_PAGE_OPTIONS.includes(nextValue)) {
      tablePerPageSelect.value = String(state.tablePerPage);
      return;
    }
    state.tablePerPage = nextValue;
    state.tablePage = 1;
    writeTablePerPagePreference(nextValue);
    renderTable();
  });
}

const handleDetailFromInput = debounce((value) => {
  state.detailFilters.from = String(value || "");
  state.detailPage = 1;
  renderDetails();
});
dateFromInput.addEventListener("input", (event) => {
  handleDetailFromInput(event.target.value);
});

const handleDetailToInput = debounce((value) => {
  state.detailFilters.to = String(value || "");
  state.detailPage = 1;
  renderDetails();
});
dateToInput.addEventListener("input", (event) => {
  handleDetailToInput(event.target.value);
});

const handleDetailSearchInput = debounce((value) => {
  state.detailSearchQuery = String(value || "").trim().toLowerCase();
  state.detailPage = 1;
  renderDetails();
});
detailSearchInput.addEventListener("input", (event) => {
  handleDetailSearchInput(event.target.value);
});

detailsPrevPage.addEventListener("click", () => {
  if (state.detailPage > 1) {
    state.detailPage--;
    renderDetails();
  }
});

detailsNextPage.addEventListener("click", () => {
  state.detailPage++;
  renderDetails();
});

if (tablePrevPage) {
  tablePrevPage.addEventListener("click", () => {
    if (state.tablePage > 1) {
      state.tablePage--;
      renderTable();
    }
  });
}

if (tableNextPage) {
  tableNextPage.addEventListener("click", () => {
    state.tablePage++;
    renderTable();
  });
}

detailsTableBody.addEventListener("click", handleDetailsTableToggle);
if (detailsCompareClear) {
  detailsCompareClear.addEventListener("click", () => {
    state.detailCompare = [];
    state.detailComparePanelVisible = false;
    renderComparePanel();
  });
}
if (detailsCompareClose) {
  detailsCompareClose.addEventListener("click", () => {
    state.detailComparePanelVisible = false;
    renderComparePanel();
  });
}
if (detailsCompareModal) {
  detailsCompareModal.addEventListener("click", (event) => {
    if (event.target === detailsCompareModal) {
      state.detailComparePanelVisible = false;
      renderComparePanel();
    }
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.detailComparePanelVisible) {
    state.detailComparePanelVisible = false;
    renderComparePanel();
  }
});
if (detailsCompareBarButton) {
  detailsCompareBarButton.addEventListener("click", () => {
    if (
      Array.isArray(state.detailCompare) &&
      state.detailCompare.length >= COMPARE_MIN_ITEMS
    ) {
      state.detailComparePanelVisible = true;
      renderComparePanel();
    }
  });
}

if (addForm) {
  addForm.addEventListener("submit", handleAddSitemap);
}
if (addFeedForm) {
  addFeedForm.addEventListener("submit", handleAddFeed);
}
if (discoverForm) {
  discoverForm.addEventListener("submit", handleDiscoverSubmit);
}
if (discoverListElement) {
  discoverListElement.addEventListener("click", handleDiscoverListClick);
  discoverListElement.addEventListener("change", handleDiscoverSelectionChange);
}
if (discoverAddSelectedButton) {
  discoverAddSelectedButton.addEventListener("click", handleDiscoverAddSelected);
}
if (discoverClearButton) {
  discoverClearButton.addEventListener("click", () => {
    resetDiscoverySection({ clearInput: false });
  });
}

if (adderTabButtons.length) {
  adderTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateAdderTab(button.dataset.tab);
    });
  });
  const initialTab = adderTabButtons[0]?.dataset?.tab || "discover";
  activateAdderTab(initialTab);
}

renderDiscoveryResults();

async function loadSitemaps() {
  if (!state.sitemaps.length) {
    state.rows = [];
    renderDomainMenu();
    renderTagMenu();
    renderTable();
    setStatus("Listede sitemap bulunmuyor. Yeni bir URL ekleyebilirsiniz.");
    notificationManager.reset();
    scanNotificationCenter.reset();
    renderDiscoveryResults();
    return;
  }

  setStatus("Sitemap verileri yÃƒÂ¼kleniyor...");
  toggleLoading(true);
  state.editingUrl = null;
  resetDetails();
  renderDomainMenu();
  renderTagMenu();
  showSkeletonLoader(state.sitemaps.length);

  try {
    const rows = await Promise.all(state.sitemaps.map((config) => buildRowFromConfig(config)));

    state.rows = rows;
    notificationManager.record(rows);
    if (rows.some((row) => row.notificationsEnabled || (row.emailEnabled && Array.isArray(row.emailRecipients) && row.emailRecipients.length > 0))) {
      notificationManager.ensurePolling();
    }
    renderDomainMenu();
    renderTagMenu();
    renderTable();
    scanNotificationCenter.refreshNow({ silent: true });

    const successCount = rows.filter((row) => !row.error).length;

    const failCount = rows.length - successCount;

    const formattedSuccess = numberFormatter.format(successCount);

    const formattedFail = numberFormatter.format(failCount);



    if (successCount && failCount) {
      const successChunk = document.createElement("span");
      successChunk.classList.add("status__chunk", "status__chunk--success");
      successChunk.textContent = t("status.refresh.successChunk", { success: formattedSuccess });

      const failChunk = document.createElement("span");
      failChunk.classList.add("status__chunk", "status__chunk--error");
      failChunk.textContent = t("status.refresh.failChunk", { failed: formattedFail });

      setStatus(
        [successChunk, document.createTextNode(" "), failChunk],
        "info",
        { toast: true }
      );
    } else if (successCount) {

      setStatus(t("status.refresh.successOnly", { success: formattedSuccess }), "success");

    } else {

      setStatus(t("status.refresh.unreachable"), "error");

    }

  } finally {
    toggleLoading(false);
    renderDiscoveryResults();
  }
}

async function buildRowFromConfig(config) {
  const title = config.title ? config.title.trim() : config.url;
  const domain = config.domain || extractDomain(config.url);
  config.domain = domain;
  const tags = sanitizeTags(config.tags);
  config.tags = tags;
  const sourceType = normalizeSourceType(config.sourceType);
  config.sourceType = sourceType;
  const notificationsEnabled = Boolean(config.notificationsEnabled);
  config.notificationsEnabled = notificationsEnabled;
  const emailRecipients = sanitizeEmails(config.emailRecipients);
  config.emailRecipients = emailRecipients;
  const emailEnabled = emailRecipients.length ? Boolean(config.emailEnabled) : false;
  config.emailEnabled = emailEnabled;

  try {
    const xmlText = await fetchSitemapText(config.url);
    const doc = parseXml(xmlText);
    const type = doc.documentElement.nodeName.toLowerCase();
    const summary = buildSummary(doc, type);
    const entries = extractEntries(doc, type, config.url);
    const recentEntries = deriveRecentEntries(entries, 8);
    const updateRate = calculateDailyUpdateRate(xmlText, 7, config.url, entries);

    return {
      title,
      url: config.url,
      domain,
      tags,
      sourceType,
      totalEntries: summary.count,
      latestDate: summary.latestDate,
      latestDateIso: summary.latestDateIso,
      rootType: type,
      rawXml: xmlText,
      recentEntries,
      error: null,
      errorType: null,
      errorCode: null,
      removable: true,
      updateRate: updateRate,
      notificationsEnabled,
      emailEnabled,
      emailRecipients,
    };
  } catch (error) {
    console.error(`"${title}" yÃƒÂ¼klenemedi:`, error);
    return {
      title,
      url: config.url,
      domain,
      tags,
      sourceType,
      totalEntries: 0,
      latestDate: "YÃƒÂ¼klenemedi",
      latestDateIso: null,
      rootType: "error",
      rawXml: null,
      recentEntries: [],
      error: error.message || "Bilinmeyen hata",
      errorType: error && error.fetchErrorType ? error.fetchErrorType : null,
      errorCode: error && error.fetchErrorCode ? error.fetchErrorCode : null,
      removable: true,
      updateRate: { average: 0, total: 0, label: "-" },
      notificationsEnabled,
      emailEnabled,
      emailRecipients,
    };
  }
}

function resetDetails() {
  state.selected = null;
  state.detailEntries = [];
  state.detailType = null;
  state.detailFilters = { from: "", to: "" };
  state.detailPrefixSummary = [];
  state.detailPrefixFilter = null;
  state.detailPrefixTotal = 0;
  state.detailIssueSummary = [];
  state.detailIssueFilter = null;
  state.detailIssueTotal = 0;
  state.isLoadingDetails = false;
  state.editingUrl = null;
  state.tagInputUrl = null;
  state.emailEditUrl = null;
  state.detailSearchQuery = "";
  state.detailPage = 1;
  state.detailMetadata = new Map();
  state.detailExpandedUrl = null;
  state.detailAccordionTabs = new Map();
  resetDetailScanState();
  dateFromInput.value = "";
  dateToInput.value = "";
  detailSearchInput.value = "";
  renderDetails();
}

async function fetchSitemapText(url) {
  const requestUrl = `${API_FETCH_SITEMAP_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const response = await fetch(requestUrl, { cache: "no-store" });

  if (response.ok) {
    return response.text();
  }

  const contentType = response.headers.get("content-type") || "";
  const errorTypeHeader = response.headers.get("x-fetch-error-type") || "";
  const errorCodeHeader = response.headers.get("x-fetch-error-code") || "";
  const rawPayload = await response.text().catch(() => "");
  let message = `${response.status} ${response.statusText || "Sitemap getirilemedi."}`;
  let errorType = errorTypeHeader && errorTypeHeader.trim() ? errorTypeHeader.trim() : "";
  let errorCode = errorCodeHeader && errorCodeHeader.trim() ? errorCodeHeader.trim() : "";

  if (rawPayload) {
    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(rawPayload);
        if (data && typeof data.message === "string" && data.message.trim()) {
          message = data.message.trim();
        }
        if (!errorType && data && typeof data.type === "string" && data.type.trim()) {
          errorType = data.type.trim();
        }
        if (!errorCode && data && typeof data.code === "string" && data.code.trim()) {
          errorCode = data.code.trim();
        }
      } catch (error) {
        message = rawPayload.trim();
      }
    } else if (rawPayload.trim()) {
      message = rawPayload.trim();
    }
  }

  const err = new Error(message);
  if (errorType) {
    err.fetchErrorType = errorType;
  }
  if (errorCode) {
    err.fetchErrorCode = errorCode;
  }
  err.httpStatus = response.status;
  throw err;
}

async function parseResponseError(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const payload = await response.text().catch(() => "");
  if (payload && contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(payload);
      if (parsed && typeof parsed.message === "string" && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch (_error) {
      return payload.trim() || fallbackMessage;
    }
  }
  return payload.trim() || fallbackMessage;
}

function formatLinkMapPreviewUrl(value) {
  if (!value) {
    return "-";
  }
  try {
    const parsed = new URL(value);
    const pathValue = `${parsed.hostname}${parsed.pathname || "/"}`;
    if (pathValue.length <= 68) {
      return pathValue;
    }
    return `${pathValue.slice(0, 65)}...`;
  } catch (_error) {
    const text = String(value);
    return text.length <= 68 ? text : `${text.slice(0, 65)}...`;
  }
}

function normalizeStatusLookupUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = new URL(trimmed);
    parsed.hash = "";
    let pathname = parsed.pathname || "/";
    if (pathname.length > 1) {
      pathname = pathname.replace(/\/+$/, "");
      if (!pathname) {
        pathname = "/";
      }
    }
    return `${parsed.origin}${pathname}${parsed.search || ""}`;
  } catch (_error) {
    return trimmed.replace(/#.*$/, "");
  }
}

function applyLinkMapStatusesToDetailEntries(sitemapUrl) {
  if (!sitemapUrl || !Array.isArray(state.detailEntries) || !state.detailEntries.length) {
    return;
  }
  const payload = state.linkMapBySitemap.get(sitemapUrl);
  if (!payload || !Array.isArray(payload.pages) || !payload.pages.length) {
    return;
  }

  const pageMap = new Map();
  payload.pages.forEach((page) => {
    const key = normalizeStatusLookupUrl(page && page.url);
    if (!key) {
      return;
    }
    pageMap.set(key, page);
  });
  if (!pageMap.size) {
    return;
  }

  const linkStatusesBySource = new Map();
  if (Array.isArray(payload.links) && payload.links.length) {
    payload.links.forEach((link) => {
      const sourceKey = normalizeStatusLookupUrl(link && link.sourceUrl);
      const targetKey = normalizeStatusLookupUrl(link && link.targetUrl);
      if (!sourceKey || !targetKey) {
        return;
      }

      const linkStatus = Number.isFinite(Number(link && link.statusCode))
        ? Number(link.statusCode)
        : null;
      const pageStatus = pageMap.has(targetKey)
        ? Number.isFinite(Number(pageMap.get(targetKey)?.statusCode))
          ? Number(pageMap.get(targetKey).statusCode)
          : null
        : null;
      const resolvedStatus = linkStatus != null ? linkStatus : pageStatus;
      const count = Number.isFinite(Number(link && link.count))
        ? Math.max(1, Math.floor(Number(link.count)))
        : 1;

      if (!linkStatusesBySource.has(sourceKey)) {
        linkStatusesBySource.set(sourceKey, []);
      }
      linkStatusesBySource.get(sourceKey).push({
        url: link.targetUrl || "",
        linkUrl: link.targetUrl || "",
        anchorText: link.anchorText || "",
        statusCode: resolvedStatus,
        status: resolvedStatus,
        category:
          (link && link.statusCategory) ||
          (resolvedStatus != null ? getStatusCategory(resolvedStatus) : "other"),
        count,
        checkedAt: typeof payload.generatedAt === "string" ? payload.generatedAt : null,
      });
    });
  }

  const generatedAt = typeof payload.generatedAt === "string" ? payload.generatedAt : null;

  state.detailEntries.forEach((entry) => {
    const entryKey = normalizeStatusLookupUrl(entry && entry.href);
    if (!entryKey) {
      return;
    }
    const pageInfo = pageMap.get(entryKey);
    if (!pageInfo) {
      return;
    }

    const pageStatusCode = Number.isFinite(Number(pageInfo.statusCode))
      ? Number(pageInfo.statusCode)
      : null;

    if (pageStatusCode != null) {
      entry.statusCode = pageStatusCode;
      entry.category = getStatusCategory(pageStatusCode);
    }
    const linkStatuses = linkStatusesBySource.get(entryKey);
    if (Array.isArray(linkStatuses) && linkStatuses.length) {
      entry.headingLinkStatuses = linkStatuses;
      entry.headingLinksCheckedAt = generatedAt || entry.headingLinksCheckedAt || null;
    }
    if (generatedAt) {
      entry.crawledAt = generatedAt;
    }
  });
}

async function loadSavedLinkMap(sitemapUrl) {
  if (!sitemapUrl || state.linkMapBySitemap.has(sitemapUrl) || state.linkMapChecked.has(sitemapUrl)) {
    return;
  }
  try {
    const response = await fetch(
      `${API_LINK_MAP_LATEST_ENDPOINT}?url=${encodeURIComponent(sitemapUrl)}`,
      { cache: "no-store" }
    );
    if (response.status === 404) {
      state.linkMapChecked.add(sitemapUrl);
      return;
    }
    if (!response.ok) {
      throw new Error(await parseResponseError(response, t("details.linkMap.error", { error: response.status })));
    }
    const payload = await response.json();
    if (payload && typeof payload === "object") {
      state.linkMapBySitemap.set(sitemapUrl, payload);
      state.linkMapChecked.add(sitemapUrl);
      if (state.selected && state.selected.url === sitemapUrl && !state.selected.isDomainAggregate) {
        applyLinkMapStatusesToDetailEntries(sitemapUrl);
        scheduleDetailsRender();
      }
    }
  } catch (error) {
    console.warn("Saved link map could not be loaded:", error);
  } finally {
    if (state.expandedRow === sitemapUrl) {
      renderTable();
    }
  }
}

function stopLinkMapPolling(sitemapUrl) {
  const poller = state.linkMapPollersBySitemap.get(sitemapUrl);
  if (poller) {
    clearInterval(poller);
    state.linkMapPollersBySitemap.delete(sitemapUrl);
  }
}

function requestLinkMapNotificationPermission() {
  if (typeof Notification === "undefined") {
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => undefined);
  }
}

function notifyLinkMapCompletion(row, payload) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }
  try {
    const body = t("details.linkMap.notifyBody", {
      title: row.title || row.url,
      links: numberFormatter.format(Number(payload?.metrics?.totalLinks) || 0),
    });
    new Notification(t("details.linkMap.notifyTitle"), {
      body,
      icon: "/favicon.ico",
    });
  } catch (_error) {
    // Notification failures should not block UI flow.
  }
}

function updateInlineLinkMapProgress(sitemapUrl, linkMapJob) {
  if (!sitemapUrl || !linkMapJob || state.expandedRow !== sitemapUrl) {
    return false;
  }
  const expandedRow = tableBody.querySelector(".table__expanded-row");
  if (!expandedRow) {
    return false;
  }
  const linkMapSection = expandedRow.querySelector(".table__expanded-section[data-link-map-sitemap]");
  if (!linkMapSection || linkMapSection.dataset.linkMapSitemap !== sitemapUrl) {
    return false;
  }
  const loadingText = linkMapSection.querySelector(".table__linkmap-loading");
  if (!loadingText) {
    return false;
  }

  const percent = Math.max(0, Math.min(100, Number(linkMapJob.percent) || 0));
  let progressBar = linkMapSection.querySelector(".table__linkmap-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.classList.add("table__linkmap-progress");
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.setAttribute("aria-label", t("table.expanded.linkMap"));
    loadingText.insertAdjacentElement("afterend", progressBar);
  }
  progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));

  let progressFill = progressBar.querySelector(".table__linkmap-progress-fill");
  if (!progressFill) {
    progressFill = document.createElement("div");
    progressFill.classList.add("table__linkmap-progress-fill");
    progressBar.appendChild(progressFill);
  }
  progressFill.style.width = `${percent}%`;
  progressFill.classList.toggle("table__linkmap-progress-fill--error", linkMapJob.status === "error");
  progressFill.classList.toggle("table__linkmap-progress-fill--cancelled", linkMapJob.status === "cancelled");

  const hasProgress = (Number(linkMapJob.total) || 0) > 0 || (Number(linkMapJob.processed) || 0) > 0;
  let progressText = linkMapSection.querySelector(".table__linkmap-summary--progress");
  if (hasProgress) {
    if (!progressText) {
      progressText = document.createElement("p");
      progressText.classList.add("table__linkmap-summary", "table__linkmap-summary--progress");
      progressBar.insertAdjacentElement("afterend", progressText);
    }
    progressText.textContent = t("details.linkMap.progress", {
      processed: numberFormatter.format(linkMapJob.processed || 0),
      total: numberFormatter.format(linkMapJob.total || 0),
      percent: numberFormatter.format(linkMapJob.percent || 0),
    });
  } else if (progressText) {
    progressText.remove();
  }

  const hasEta =
    Number.isFinite(Number(linkMapJob.etaSeconds)) && Number(linkMapJob.etaSeconds) > 0;
  let etaText = linkMapSection.querySelector(".table__linkmap-summary--eta");
  if (hasEta) {
    if (!etaText) {
      etaText = document.createElement("p");
      etaText.classList.add("table__linkmap-summary", "table__linkmap-summary--eta");
      if (progressText) {
        progressText.insertAdjacentElement("afterend", etaText);
      } else {
        progressBar.insertAdjacentElement("afterend", etaText);
      }
    }
    etaText.textContent = t("details.linkMap.eta", {
      seconds: numberFormatter.format(Number(linkMapJob.etaSeconds)),
    });
  } else if (etaText) {
    etaText.remove();
  }

  return true;
}

async function pollLinkMapJob(row, jobId) {
  const sitemapUrl = row && row.url ? row.url : "";
  if (!sitemapUrl || !jobId) {
    return;
  }

  stopLinkMapPolling(sitemapUrl);

  const fetchJobStatus = async () => {
    const response = await fetch(`${API_LINK_MAP_JOBS_ENDPOINT}/${encodeURIComponent(jobId)}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(await parseResponseError(response, t("details.linkMap.jobError", { error: response.status })));
    }
    return response.json();
  };

  const handleSnapshot = (snapshot) => {
    const progress = snapshot?.progress || {};
    const jobState = {
      id: snapshot?.id || jobId,
      status: snapshot?.status || "queued",
      processed: Number(progress.processed) || 0,
      total: Number(progress.total) || 0,
      percent: Number(progress.percent) || 0,
      etaSeconds:
        progress.etaSeconds != null && Number.isFinite(Number(progress.etaSeconds))
          ? Number(progress.etaSeconds)
          : null,
    };
    state.linkMapJobsBySitemap.set(sitemapUrl, jobState);
    const updatedInline = updateInlineLinkMapProgress(sitemapUrl, jobState);
    if (!updatedInline && state.expandedRow === sitemapUrl) {
      renderTable();
    }
  };

  const finishJob = (snapshot) => {
    stopLinkMapPolling(sitemapUrl);
    state.linkMapLoading.delete(sitemapUrl);
    state.linkMapJobsBySitemap.delete(sitemapUrl);
    if (snapshot && snapshot.result) {
      state.linkMapBySitemap.set(sitemapUrl, snapshot.result);
      state.linkMapChecked.add(sitemapUrl);
      const isSelectedSitemap =
        state.selected &&
        !state.selected.isDomainAggregate &&
        state.selected.url === sitemapUrl;
      if (isSelectedSitemap) {
        applyLinkMapStatusesToDetailEntries(sitemapUrl);
        scheduleDetailsRender();
      }
    }
    renderTable();
  };

  const pollOnce = async () => {
    const snapshot = await fetchJobStatus();
    handleSnapshot(snapshot);

    if (snapshot.status === "complete") {
      finishJob(snapshot);
      setStatus(
        t("details.linkMap.done", {
          pages: numberFormatter.format(Number(snapshot?.result?.totalUrls) || 0),
          links: numberFormatter.format(Number(snapshot?.result?.metrics?.totalLinks) || 0),
        }),
        "success"
      );
      if (snapshot?.result) {
        notifyLinkMapCompletion(row, snapshot.result);
      }
      return true;
    }

    if (snapshot.status === "error") {
      finishJob(snapshot);
      setStatus(
        t("details.linkMap.jobError", {
          error: snapshot?.error || t("datetime.unknown"),
        }),
        "error"
      );
      return true;
    }

    if (snapshot.status === "cancelled") {
      finishJob(snapshot);
      setStatus(t("details.linkMap.jobCancelled"), "info");
      return true;
    }

    return false;
  };

  try {
    const done = await pollOnce();
    if (done) {
      return;
    }
  } catch (error) {
    stopLinkMapPolling(sitemapUrl);
    state.linkMapLoading.delete(sitemapUrl);
    state.linkMapJobsBySitemap.delete(sitemapUrl);
    renderTable();
    setStatus(
      t("details.linkMap.jobError", {
        error: error?.message || t("datetime.unknown"),
      }),
      "error"
    );
    return;
  }

  const poller = setInterval(async () => {
    try {
      const done = await pollOnce();
      if (done) {
        stopLinkMapPolling(sitemapUrl);
      }
    } catch (error) {
      stopLinkMapPolling(sitemapUrl);
      state.linkMapLoading.delete(sitemapUrl);
      state.linkMapJobsBySitemap.delete(sitemapUrl);
      renderTable();
      setStatus(
        t("details.linkMap.jobError", {
          error: error?.message || t("datetime.unknown"),
        }),
        "error"
      );
    }
  }, 1000);

  state.linkMapPollersBySitemap.set(sitemapUrl, poller);
}

async function cancelLinkMapForSitemap(row) {
  const sitemapUrl = row && row.url ? row.url : "";
  if (!sitemapUrl) {
    return;
  }
  const jobState = state.linkMapJobsBySitemap.get(sitemapUrl);
  const jobId = jobState && jobState.id ? jobState.id : "";
  if (!jobId) {
    return;
  }
  try {
    const response = await fetch(`${API_LINK_MAP_JOBS_ENDPOINT}/${encodeURIComponent(jobId)}/cancel`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(await parseResponseError(response, t("details.linkMap.jobError", { error: response.status })));
    }
    setStatus(t("details.linkMap.cancelRequested"), "info");
  } catch (error) {
    setStatus(
      t("details.linkMap.jobError", {
        error: error?.message || t("datetime.unknown"),
      }),
      "error"
    );
  }
}

async function buildLinkMapForSitemap(row) {
  const sitemapUrl = row && row.url ? row.url : "";
  if (!sitemapUrl || state.linkMapLoading.has(sitemapUrl)) {
    return;
  }
  requestLinkMapNotificationPermission();
  stopLinkMapPolling(sitemapUrl);
  state.linkMapLoading.add(sitemapUrl);
  state.linkMapJobsBySitemap.set(sitemapUrl, {
    id: "",
    status: "queued",
    processed: 0,
    total: 0,
    percent: 0,
    etaSeconds: null,
  });
  renderTable();
  setStatus(t("details.linkMap.start", { title: row.title || sitemapUrl }), "info");
  try {
    const response = await fetch(API_LINK_MAP_JOBS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sitemapUrl,
        force: true,
      }),
    });
    if (!response.ok) {
      throw new Error(await parseResponseError(response, t("details.linkMap.error", { error: response.status })));
    }
    const snapshot = await response.json();
    state.linkMapJobsBySitemap.set(sitemapUrl, {
      id: snapshot?.id || "",
      status: snapshot?.status || "queued",
      processed: Number(snapshot?.progress?.processed) || 0,
      total: Number(snapshot?.progress?.total) || 0,
      percent: Number(snapshot?.progress?.percent) || 0,
      etaSeconds:
        snapshot?.progress?.etaSeconds != null && Number.isFinite(Number(snapshot.progress.etaSeconds))
          ? Number(snapshot.progress.etaSeconds)
          : null,
    });
    renderTable();
    setStatus(t("details.linkMap.jobQueued"), "info");
    if (snapshot?.id) {
      await pollLinkMapJob(row, snapshot.id);
    } else {
      throw new Error(t("details.linkMap.jobError", { error: "Missing job id" }));
    }
  } catch (error) {
    const message = error?.message || t("datetime.unknown");
    setStatus(t("details.linkMap.error", { error: message }), "error");
    state.linkMapLoading.delete(sitemapUrl);
    state.linkMapJobsBySitemap.delete(sitemapUrl);
    renderTable();
  }
}

async function exportLinkMapForSitemap(row) {
  const sitemapUrl = row && row.url ? row.url : "";
  if (!sitemapUrl) {
    return;
  }
  try {
    const response = await fetch(
      `${API_LINK_MAP_EXPORT_ENDPOINT}?url=${encodeURIComponent(sitemapUrl)}&format=csv`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(await parseResponseError(response, t("details.linkMap.exportError", { error: response.status })));
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    const fallbackName = `${slugifyForExport(row.title || sitemapUrl)}-link-map.csv`;
    const disposition = response.headers.get("content-disposition") || "";
    const nameMatch = disposition.match(/filename=\"?([^\";]+)\"?/i);
    downloadLink.href = objectUrl;
    downloadLink.download = nameMatch ? nameMatch[1] : fallbackName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    setStatus(t("details.linkMap.exported"), "success");
  } catch (error) {
    const message = error?.message || t("datetime.unknown");
    setStatus(t("details.linkMap.exportError", { error: message }), "error");
  }
}

function createDefaultDetailScanState() {
  return {
    status: "idle",
    runId: null,
    sitemapUrl: null,
    startedAt: null,
    totalCount: 0,
    metadataDone: 0,
    headingDone: 0,
    lastUrl: "",
    isPaused: false,
    stopRequested: false,
    lastCompletedAt: null,
    isSingle: false,
    stats: {
      count2xx: 0,
      count3xx: 0,
      count404: 0,
      count4xx: 0,
      count5xx: 0,
      countOther: 0,
      countTimeout: 0,
    },
  };
}

function resetDetailScanState({ preserveLast = false } = {}) {
  const lastCompletedAt = preserveLast ? state.detailScan?.lastCompletedAt : null;
  state.detailScan = createDefaultDetailScanState();
  if (preserveLast) {
    state.detailScan.lastCompletedAt = lastCompletedAt;
  }
  detailScanBuffer.urlResults.length = 0;
  detailScanBuffer.headingLinks.length = 0;
  detailScanRequestId += 1;
  if (detailScanProgressTimer) {
    clearTimeout(detailScanProgressTimer);
    detailScanProgressTimer = null;
  }
  setDetailsFetchNote("");
  updateDetailsScanControls();
}

function updateDetailsScanControls() {
  const hasSelection = Boolean(state.selected && state.detailEntries.length);
  const running = state.detailScan.status === "running";
  setDetailsScanEnabled(hasSelection && !running);
  setDetailsPauseEnabled(running);
  setDetailsStopEnabled(running);
  setDetailsPauseLabel(Boolean(state.detailScan.isPaused));
}

function formatScanUrlPath(value) {
  if (!value) {
    return "";
  }
  try {
    const parsed = new URL(value);
    return `${parsed.pathname}${parsed.search || ""}` || parsed.pathname || value;
  } catch (error) {
    return value;
  }
}

function buildScanStatusMessage({ complete = false } = {}) {
  const scan = state.detailScan || {};
  const total = numberFormatter.format(scan.totalCount || 0);
  const metadataDone = numberFormatter.format(scan.metadataDone || 0);
  const headingDone = numberFormatter.format(scan.headingDone || 0);
  const lastUrl = scan.lastUrl ? formatScanUrlPath(scan.lastUrl) : "";

  let baseMessage = t("details.status.scanRunning");
  if (scan.status === "error") {
    baseMessage = t("details.status.scanFailed", { error: scan.error || "" });
  } else if (scan.status === "completed") {
    baseMessage = t("details.status.scanCompleted");
  } else if (scan.status === "stopped") {
    baseMessage = t("details.status.scanStopped");
  } else if (scan.isPaused) {
    baseMessage = t("details.status.scanPaused");
  }

  const metadataKey = complete ? "details.metadata.progressDone" : "details.metadata.progress";
  const metadataKeyWithLast = complete
    ? "details.metadata.progressDoneWithLast"
    : "details.metadata.progressWithLast";
  const metadataText = lastUrl
    ? t(metadataKeyWithLast, { done: metadataDone, total, url: lastUrl })
    : t(metadataKey, { done: metadataDone, total });
  const headingKey = complete
    ? "details.headingLinks.progressDone"
    : "details.headingLinks.progress";
  const headingText = t(headingKey, { done: headingDone, total });
  const lastScanStamp = scan.lastCompletedAt ? formatDateTime(scan.lastCompletedAt) : "";
  const lastScanText = lastScanStamp ? t("details.scan.last", { timestamp: lastScanStamp }) : "";
  const parts = [baseMessage, metadataText, headingText, lastScanText].filter(Boolean);
  return parts.join(" | ");
}

function setDetailsFetchNote(message) {
  if (!detailsFetchNote) {
    return;
  }
  detailsFetchNote.textContent = message || "";
  detailsFetchNote.hidden = !message;
}

function getStatusCategory(statusCode) {
  if (!Number.isFinite(Number(statusCode))) {
    return "other";
  }
  const code = Number(statusCode);
  if (code >= 200 && code < 300) {
    return "2xx";
  }
  if (code >= 300 && code < 400) {
    return "3xx";
  }
  if (code >= 400 && code < 500) {
    return "4xx";
  }
  if (code >= 500 && code < 600) {
    return "5xx";
  }
  return "other";
}

function updateScanStats(statusCode, category) {
  const stats = state.detailScan.stats;
  if (!stats) {
    return;
  }
  const code = Number.isFinite(Number(statusCode)) ? Number(statusCode) : null;
  const resolvedCategory = category || getStatusCategory(code);
  if (resolvedCategory === "2xx") {
    stats.count2xx += 1;
  } else if (resolvedCategory === "3xx") {
    stats.count3xx += 1;
  } else if (resolvedCategory === "5xx") {
    stats.count5xx += 1;
  } else if (resolvedCategory === "4xx") {
    stats.count4xx += 1;
    if (code === 404) {
      stats.count404 += 1;
    }
  } else if (resolvedCategory === "timeout") {
    stats.countTimeout += 1;
  } else {
    stats.countOther += 1;
  }
}

function buildScanSummary() {
  const stats = state.detailScan.stats || {};
  const total =
    stats.count2xx +
    stats.count3xx +
    stats.count4xx +
    stats.count5xx +
    stats.countOther +
    stats.countTimeout;
  const score = total ? Math.round((stats.count2xx / total) * 100) : null;
  return {
    count2xx: stats.count2xx || 0,
    count3xx: stats.count3xx || 0,
    count404: stats.count404 || 0,
    count4xx: stats.count4xx || 0,
    count5xx: stats.count5xx || 0,
    countTimeout: stats.countTimeout || 0,
    countOther: stats.countOther || 0,
    score,
  };
}

function normalizeSchemaTypeValue(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim();
}

function extractSchemaTypesFromValue(value, bucket, visited) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => extractSchemaTypesFromValue(entry, bucket, visited));
    return;
  }
  if (typeof value !== "object") {
    return;
  }
  if (visited && visited.has(value)) {
    return;
  }
  if (visited) {
    visited.add(value);
  }

  const rawType = value["@type"];
  if (Array.isArray(rawType)) {
    rawType.forEach((entry) => {
      const normalized = normalizeSchemaTypeValue(entry);
      if (normalized) {
        bucket.add(normalized);
      }
    });
  } else {
    const normalized = normalizeSchemaTypeValue(rawType);
    if (normalized) {
      bucket.add(normalized);
    }
  }

  Object.values(value).forEach((entry) => {
    if (entry && typeof entry === "object") {
      extractSchemaTypesFromValue(entry, bucket, visited);
    }
  });
}

function extractSchemaTypes(schemaBlocks) {
  const bucket = new Set();
  const visited = new WeakSet();
  if (!Array.isArray(schemaBlocks)) {
    return [];
  }
  schemaBlocks.forEach((block) => {
    if (block && block.data) {
      extractSchemaTypesFromValue(block.data, bucket, visited);
    }
  });
  return Array.from(bucket).sort((a, b) => a.localeCompare(b));
}

function parsePageMetadata(html, baseUrl) {
  const result = {
    title: "",
    description: "",
    paragraphs: [],
    schemaTypes: [],
    headings: [],
    layout: [],
    schema: [],
  };

  if (!html || typeof html !== "string") {
    return result;
  }

  let doc;
  try {
    doc = new DOMParser().parseFromString(html, "text/html");
  } catch (error) {
    return result;
  }

  const titleEl = doc.querySelector("title");
  if (titleEl && titleEl.textContent) {
    result.title = titleEl.textContent.trim();
  }

  const descEl =
    doc.querySelector('meta[name="description"]') ||
    doc.querySelector('meta[property="og:description"]');
  if (descEl) {
    const content = descEl.getAttribute("content");
    if (content) {
      result.description = content.trim();
    }
  }

  const contentRoot =
    doc.querySelector("main article") ||
    doc.querySelector("article") ||
    doc.querySelector("main") ||
    doc.querySelector('[role="main"]') ||
    doc.body ||
    doc;
  const paragraphNodes = Array.from(contentRoot.querySelectorAll("p"));
  const paragraphSet = new Set();
  const paragraphs = [];
  paragraphNodes.forEach((node) => {
    if (!node || !node.textContent) {
      return;
    }
    if (typeof node.closest === "function") {
      const ignoredContainer = node.closest(
        "header, nav, footer, aside, form, script, style, noscript, template"
      );
      if (ignoredContainer) {
        return;
      }
    }
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text || text.length < CONTENT_PARAGRAPH_MIN_LENGTH) {
      return;
    }
    const normalized = text.toLowerCase();
    if (!normalized || paragraphSet.has(normalized)) {
      return;
    }
    paragraphSet.add(normalized);
    paragraphs.push(text);
  });
  result.paragraphs = paragraphs;

  const headings = [];
  const headingNodes = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  const bodyRoot = doc.body || doc;
  const isHeadingNode = (node) => {
    if (!node || !node.tagName) {
      return false;
    }
    const tag = node.tagName.toLowerCase();
    return tag.length === 2 && tag.startsWith("h") && tag[1] >= "1" && tag[1] <= "6";
  };
  const isAnchorOnlyLink = (href) => {
    if (!href || typeof href !== "string") {
      return false;
    }
    const trimmed = href.trim();
    if (!trimmed) {
      return false;
    }
    if (trimmed.startsWith("#")) {
      return true;
    }
    try {
      const resolved = baseUrl ? new URL(trimmed, baseUrl) : new URL(trimmed);
      const baseResolved = baseUrl ? new URL(baseUrl) : null;
      if (baseResolved) {
        if (
          resolved.origin === baseResolved.origin &&
          resolved.pathname === baseResolved.pathname &&
          resolved.search === baseResolved.search &&
          resolved.hash
        ) {
          return true;
        }
      }
    } catch (_error) {
      return false;
    }
    return false;
  };

  const collectLinksBetweenHeadings = (startNode, endNode) => {
    if (!startNode || !bodyRoot || !bodyRoot.querySelectorAll) {
      return [];
    }
    const links = [];
    const seen = new Set();
    const showElements =
      typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_ELEMENT : 1;
    const walker = doc.createTreeWalker(bodyRoot, showElements);
    walker.currentNode = startNode;
    let current;
    while ((current = walker.nextNode())) {
      if (endNode && current === endNode) {
        break;
      }
      if (isHeadingNode(current)) {
        break;
      }
      if (current.tagName && current.tagName.toLowerCase() === "a") {
        const rawHref = current.getAttribute("href");
        if (!rawHref) {
          continue;
        }
        if (isAnchorOnlyLink(rawHref)) {
          continue;
        }
        let href = rawHref;
        try {
          href = baseUrl ? new URL(rawHref, baseUrl).href : rawHref;
        } catch (error) {
          href = rawHref;
        }
        if (isAnchorOnlyLink(href)) {
          continue;
        }
        const normalized = href.trim();
        if (!normalized || seen.has(normalized)) {
          continue;
        }
        seen.add(normalized);
        links.push({
          href: normalized,
          text: current.textContent ? current.textContent.trim() : "",
        });
      }
    }
    return links;
  };

  headingNodes.forEach((node, index) => {
    if (!node) {
      return;
    }
    const tag = node.tagName ? node.tagName.toLowerCase() : "";
    const level = tag && tag.startsWith("h") ? Number(tag.slice(1)) : null;
    const text = node.textContent ? node.textContent.trim() : "";
    if (!text) {
      return;
    }
    const nextHeading = headingNodes[index + 1] || null;
    const links = collectLinksBetweenHeadings(node, nextHeading);

    headings.push({
      level,
      tag: tag || null,
      text,
      links,
    });
  });

  result.headings = headings;
  result.layout = buildHeadingLayout(headings);

  const schemaBlocks = [];
  const schemaNodes = doc.querySelectorAll('script[type="application/ld+json"]');
  schemaNodes.forEach((node) => {
    if (!node || !node.textContent) {
      return;
    }
    const raw = node.textContent.trim();
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      schemaBlocks.push({ data: parsed, raw });
    } catch (error) {
      schemaBlocks.push({ data: null, raw, error: error?.message || "Invalid JSON" });
    }
  });
  result.schema = schemaBlocks;
  result.schemaTypes = extractSchemaTypes(schemaBlocks);
  return result;
}

function buildHeadingLayout(headings) {
  if (!Array.isArray(headings) || !headings.length) {
    return [];
  }
  const root = [];
  const stack = [];
  headings.forEach((heading) => {
    if (!heading) {
      return;
    }
    const level = Number.isFinite(Number(heading.level)) ? Number(heading.level) : 0;
    const node = {
      level,
      text: heading.text || heading.title || heading.heading || "-",
      children: [],
    };
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    if (!stack.length) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  });
  return root;
}

function buildLayoutList(nodes) {
  const list = document.createElement("ul");
  list.classList.add("details-metadata__layout");
  nodes.forEach((node) => {
    if (!node) {
      return;
    }
    const item = document.createElement("li");
    item.classList.add("details-metadata__layout-item");
    const label = document.createElement("span");
    label.classList.add("details-metadata__layout-label");
    const level = Number.isFinite(Number(node.level)) ? Number(node.level) : null;
    label.textContent = level ? `H${level} ${node.text}` : node.text;
    item.appendChild(label);
    if (Array.isArray(node.children) && node.children.length) {
      item.appendChild(buildLayoutList(node.children));
    }
    list.appendChild(item);
  });
  return list;
}
async function fetchPageHtml(url) {
  const requestUrl = `${API_FETCH_PAGE_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const start = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(requestUrl, {
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error("Request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const elapsedMs = Math.round(performance.now() - start);
  const htmlText = await response.text().catch(() => "");
  if (!response.ok) {
    const message = htmlText || `${response.status} ${response.statusText || "Error"}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return {
    html: htmlText || "",
    statusCode: response.status,
    responseTimeMs: elapsedMs,
    fetchMode: response.headers.get("X-Page-Fetch") || "",
  };
}

function collectHeadingLinkTargets(headings) {
  if (!Array.isArray(headings)) {
    return [];
  }
  const urls = [];
  const seen = new Set();
  headings.forEach((heading) => {
    if (!heading || !Array.isArray(heading.links)) {
      return;
    }
    heading.links.forEach((link) => {
      if (!link || !link.href) {
        return;
      }
      const href = String(link.href);
      if (seen.has(href)) {
        return;
      }
      seen.add(href);
      urls.push(href);
    });
  });
  return urls.slice(0, HEADING_LINK_STATUS_MAX_URLS);
}

async function fetchHeadingLinkStatuses(urls, { timeoutMs } = {}) {
  if (!Array.isArray(urls) || !urls.length) {
    return [];
  }
  const controller = new AbortController();
  const timeout = timeoutMs
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;
  let response;
  try {
    response = await fetch(API_LINK_STATUS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      return [];
    }
    throw error;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
  if (!response.ok) {
    return [];
  }
  const payload = await response.json().catch(() => ({}));
  return Array.isArray(payload.results) ? payload.results : [];
}

async function loadDetailMetadataForUrl(url) {
  if (!url || !(state.detailMetadata instanceof Map)) {
    return null;
  }
  const existing = state.detailMetadata.get(url);
  if (existing && existing.status === "loading") {
    return detailMetadataRequests.get(url) || null;
  }
  if (existing && existing.status === "ready") {
    return existing;
  }

  const requestPromise = (async () => {
    state.detailMetadata.set(url, {
      status: "loading",
      title: (existing && existing.title) || "",
      description: (existing && existing.description) || "",
      paragraphs: (existing && existing.paragraphs) || [],
      schemaTypes: (existing && existing.schemaTypes) || [],
      headings: (existing && existing.headings) || [],
      layout: (existing && existing.layout) || [],
      schema: (existing && existing.schema) || [],
    });
    scheduleDetailsRender();

    try {
      const startedAt = new Date().toISOString();
      const pageResult = await fetchPageHtml(url);
      if (pageResult.fetchMode === "puppeteer") {
        setDetailsFetchNote(t("details.fetchNote.puppeteer"));
      } else if (pageResult.fetchMode === "stale") {
        setDetailsFetchNote(t("details.fetchNote.staleWaf"));
      } else if (pageResult.fetchMode === "html") {
        setDetailsFetchNote(t("details.fetchNote.html"));
      }

      const metadata = parsePageMetadata(pageResult.html, url);

      const entry = state.detailEntries.find((item) => item && item.href === url);
      if (entry) {
        entry.title = metadata.title || entry.title || "";
        entry.description = metadata.description || entry.description || "";
        entry.statusCode = pageResult.statusCode;
        entry.category = getStatusCategory(pageResult.statusCode);
        entry.responseTimeMs = pageResult.responseTimeMs;
        entry.crawledAt = startedAt;
      }

      state.detailMetadata.set(url, {
        status: "ready",
        title: metadata.title || (entry && entry.title) || "",
        description: metadata.description || (entry && entry.description) || "",
        paragraphs: metadata.paragraphs || [],
        schemaTypes: metadata.schemaTypes || [],
        headings: metadata.headings || [],
        layout: metadata.layout || [],
        schema: metadata.schema || [],
      });
      if (Array.isArray(state.detailCompare) && state.detailCompare.length) {
        state.detailCompare = state.detailCompare.map((item) => {
          if (!item || item.url !== url) {
            return item;
          }
          return {
            ...item,
            statusCode:
              Number.isFinite(Number(pageResult.statusCode))
                ? Number(pageResult.statusCode)
                : item.statusCode ?? null,
            title: metadata.title || item.title || "",
            description: metadata.description || item.description || "",
            paragraphs: metadata.paragraphs || item.paragraphs || [],
            schemaTypes: metadata.schemaTypes || item.schemaTypes || [],
            headings: metadata.headings || item.headings || [],
            layout: metadata.layout || item.layout || [],
            schema: metadata.schema || item.schema || [],
          };
        });
      }
      scheduleDetailsRender();

      return metadata;
    } catch (error) {
      state.detailMetadata.set(url, {
        status: "error",
        title: (existing && existing.title) || "",
        description: (existing && existing.description) || "",
        paragraphs: (existing && existing.paragraphs) || [],
        schemaTypes: (existing && existing.schemaTypes) || [],
        headings: (existing && existing.headings) || [],
        layout: (existing && existing.layout) || [],
        schema: (existing && existing.schema) || [],
        error: error?.message || "Unknown error",
      });
      scheduleDetailsRender();
      return null;
    } finally {
      detailMetadataRequests.delete(url);
    }
  })();

  detailMetadataRequests.set(url, requestPromise);
  return requestPromise;
}

function queueScanProgress(sitemapUrl, urlResults, headingLinks) {
  if (!sitemapUrl) {
    return;
  }
  if (Array.isArray(urlResults) && urlResults.length) {
    detailScanBuffer.urlResults.push(...urlResults);
  }
  if (Array.isArray(headingLinks) && headingLinks.length) {
    detailScanBuffer.headingLinks.push(...headingLinks);
  }
  const pendingCount = detailScanBuffer.urlResults.length + detailScanBuffer.headingLinks.length;
  if (pendingCount >= SCAN_PROGRESS_BATCH) {
    flushScanProgress(sitemapUrl);
    return;
  }
  if (!detailScanProgressTimer) {
    detailScanProgressTimer = setTimeout(() => {
      flushScanProgress(sitemapUrl);
    }, SCAN_PROGRESS_FLUSH_MS);
  }
}

async function flushScanProgress(sitemapUrl) {
  if (!sitemapUrl) {
    return;
  }
  if (detailScanFlushInFlight) {
    return;
  }
  if (!detailScanBuffer.urlResults.length && !detailScanBuffer.headingLinks.length) {
    return;
  }
  if (detailScanProgressTimer) {
    clearTimeout(detailScanProgressTimer);
    detailScanProgressTimer = null;
  }
  const urlResults = detailScanBuffer.urlResults.splice(0);
  const headingLinks = detailScanBuffer.headingLinks.splice(0);
  detailScanFlushInFlight = true;
  try {
    const response = await fetch(API_SCAN_PROGRESS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sitemapUrl, urlResults, headingLinks }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    detailScanBuffer.urlResults.unshift(...urlResults);
    detailScanBuffer.headingLinks.unshift(...headingLinks);
    console.warn("Scan progress update failed:", error);
  } finally {
    detailScanFlushInFlight = false;
  }
}

async function completeDetailsScanRun() {
  if (!state.detailScan.runId || !state.detailScan.sitemapUrl) {
    return;
  }
  await flushScanProgress(state.detailScan.sitemapUrl);
  const summary = buildScanSummary();
  const response = await fetch(API_SCAN_COMPLETE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId: state.detailScan.runId,
      sitemapUrl: state.detailScan.sitemapUrl,
      totalUrls: state.detailScan.totalCount,
      sampledUrls: state.detailScan.totalCount,
      summary,
    }),
  });
  if (response.ok) {
    scanNotificationCenter.refreshNow({ silent: true });
  }
}

function scheduleDetailsRender() {
  if (detailRenderScheduled) {
    return;
  }
  detailRenderScheduled = true;
  requestAnimationFrame(() => {
    detailRenderScheduled = false;
    renderDetails();
  });
}

function updateDetailScanStatus() {
  if (!state.detailScan || state.detailScan.status === "idle") {
    return;
  }
  const complete = state.detailScan.status === "completed";
  setDetailStatus(buildScanStatusMessage({ complete }));
}

async function scanSingleUrl(url, { requestId, isSingle } = {}) {
  if (!url) {
    return;
  }
  const currentRequest = detailScanRequestId;
  if (requestId && requestId !== currentRequest) {
    return;
  }

  const startedAt = new Date().toISOString();
  const entry = state.detailEntries.find((item) => item && item.href === url);
  const previousStats = entry ? getHeadingStatusCounts(entry) : null;
  const pageResult = await fetchPageHtml(url);
  if (pageResult.fetchMode === "puppeteer") {
    setDetailsFetchNote(t("details.fetchNote.puppeteer"));
  } else if (pageResult.fetchMode === "stale") {
    setDetailsFetchNote(t("details.fetchNote.staleWaf"));
  } else if (pageResult.fetchMode === "html") {
    setDetailsFetchNote(t("details.fetchNote.html"));
  }
  const metadata = parsePageMetadata(pageResult.html, url);
  const headingTargets = collectHeadingLinkTargets(metadata.headings);
  const headingStatusResults = await fetchHeadingLinkStatuses(headingTargets);

  if (requestId && requestId !== detailScanRequestId) {
    return;
  }

  if (entry) {
    entry.title = metadata.title || "";
    entry.description = metadata.description || "";
    entry.statusCode = pageResult.statusCode;
    entry.category = getStatusCategory(pageResult.statusCode);
    entry.responseTimeMs = pageResult.responseTimeMs;
    entry.crawledAt = startedAt;
    entry.headingLinkStatuses = headingStatusResults;
    entry.headingLinksCheckedAt = startedAt;
  }

  if (state.detailMetadata instanceof Map) {
    state.detailMetadata.set(url, {
      status: "ready",
      title: metadata.title || "",
      description: metadata.description || "",
      paragraphs: metadata.paragraphs || [],
      schemaTypes: metadata.schemaTypes || [],
      headings: metadata.headings || [],
      layout: metadata.layout || [],
      schema: metadata.schema || [],
    });
  }

  const urlResult = {
    url,
    statusCode: pageResult.statusCode,
    category: getStatusCategory(pageResult.statusCode),
    title: metadata.title || "",
    description: metadata.description || "",
    responseTimeMs: pageResult.responseTimeMs,
    crawledAt: startedAt,
  };

  const headingLinks = headingStatusResults.map((result) => {
    const rawStatus = result && (result.status ?? result.statusCode);
    const statusCode = Number.isFinite(Number(rawStatus)) ? Number(rawStatus) : null;
    return {
      pageUrl: url,
      linkUrl: result.url || "",
      statusCode,
      category: result.category || getStatusCategory(statusCode),
      anchorText: result.anchorText || "",
      checkedAt: startedAt,
    };
  });

  if (!isSingle) {
    updateScanStats(pageResult.statusCode, urlResult.category);
  }

  queueScanProgress(state.selected?.url, [urlResult], headingLinks);
  if (isSingle && entry && previousStats && previousStats.score != null) {
    const nextStats = getHeadingStatusCounts(entry);
    if (nextStats.score != null) {
      if (nextStats.score > previousStats.score) {
        showToast(
          t("details.singleScan.improved", {
            from: previousStats.score,
            to: nextStats.score,
          }),
          "success"
        );
      } else if (nextStats.score < previousStats.score) {
        showToast(
          t("details.singleScan.regressed", {
            from: previousStats.score,
            to: nextStats.score,
          }),
          "warning"
        );
      } else {
        showToast(t("details.singleScan.unchanged", { score: nextStats.score }), "info");
      }
    }
  }
  return { urlResult, headingLinks };
}

async function runScanQueue(urls, requestId) {
  const queue = Array.isArray(urls) ? [...urls] : [];
  const total = queue.length;
  state.detailScan.totalCount = total;
  state.detailScan.metadataDone = 0;
  state.detailScan.headingDone = 0;

  if (!total) {
    setDetailStatus(t("details.scan.noData"));
    state.detailScan.status = "completed";
    updateDetailsScanControls();
    return;
  }

  const workers = Array.from({ length: METADATA_CONCURRENCY_LIMIT }, () =>
    (async () => {
      while (queue.length) {
        if (requestId !== detailScanRequestId) {
          return;
        }
        if (state.detailScan.stopRequested) {
          return;
        }
        if (state.detailScan.isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        const url = queue.shift();
        if (!url) {
          continue;
        }
        try {
          state.detailScan.lastUrl = url;
          await scanSingleUrl(url, { requestId });
        } catch (error) {
          console.warn("Scan failed for", url, error);
        } finally {
          state.detailScan.metadataDone += 1;
          state.detailScan.headingDone += 1;
          if (state.detailScan.metadataDone % 5 === 0) {
            scheduleDetailsRender();
          }
          updateDetailScanStatus();
        }
      }
    })()
  );

  await Promise.all(workers);
}

async function handleDetailsScanClick() {
  if (!state.selected || !state.detailEntries.length) {
    showToast(t("details.scan.noData"), "error");
    return;
  }
  if (state.detailScan.status === "running") {
    return;
  }

  resetDetailScanState({ preserveLast: true });
  const requestId = ++detailScanRequestId;
  state.detailScan.status = "running";
  state.detailScan.isPaused = false;
  state.detailScan.stopRequested = false;
  state.detailScan.sitemapUrl = state.selected.url;
  state.detailScan.startedAt = new Date().toISOString();
  updateDetailsScanControls();
  updateDetailScanStatus();

  try {
    const response = await fetch(API_SCAN_START_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: state.selected.url }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || `${response.status}`);
    }
    const payload = await response.json().catch(() => ({}));
    if (requestId !== detailScanRequestId) {
      return;
    }
    state.detailScan.runId = payload.runId || null;
    state.detailScan.totalCount = Number(payload.sampledCount) || payload.urls?.length || 0;

    await runScanQueue(Array.isArray(payload.urls) ? payload.urls : [], requestId);

    if (state.detailScan.stopRequested) {
      state.detailScan.status = "stopped";
      updateDetailScanStatus();
      updateDetailsScanControls();
      return;
    }

    await completeDetailsScanRun();
    state.detailScan.status = "completed";
    state.detailScan.lastCompletedAt = new Date().toISOString();
    updateDetailsScanControls();
    updateDetailScanStatus();
    scheduleDetailsRender();
  } catch (error) {
    if (requestId !== detailScanRequestId) {
      return;
    }
    state.detailScan.status = "error";
    state.detailScan.error = error?.message || "Bilinmeyen hata";
    updateDetailsScanControls();
    updateDetailScanStatus();
  }
}

function handleDetailsPauseClick() {
  if (state.detailScan.status !== "running") {
    return;
  }
  state.detailScan.isPaused = !state.detailScan.isPaused;
  updateDetailsScanControls();
  updateDetailScanStatus();
}

function handleDetailsStopClick() {
  if (state.detailScan.status !== "running") {
    return;
  }
  state.detailScan.stopRequested = true;
  state.detailScan.isPaused = false;
  updateDetailsScanControls();
  updateDetailScanStatus();
}

async function handleSingleCrawlClick(targetUrl) {
  if (!state.selected || !targetUrl) {
    return;
  }
  try {
    showToast(t("details.singleScan.start"), "info");
    await scanSingleUrl(targetUrl, { isSingle: true });
    await flushScanProgress(state.selected.url);
    showToast(t("details.singleScan.done"), "success");
    scheduleDetailsRender();
  } catch (error) {
    showToast(t("details.singleScan.error", { error: error.message || "Bilinmeyen hata" }), "error");
  }
}

async function copyToClipboard(text) {
  if (!text) {
    return false;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

async function handleDetailsTableToggle(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const actionButton = target.closest("button[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "single-crawl") {
      const href = actionButton.dataset.href;
      handleSingleCrawlClick(href);
    }
    if (action === "open-url") {
      const href = actionButton.dataset.href;
      if (!href) {
        showToast(t("details.toast.openFail"), "error");
        return;
      }
      const opened = window.open(href, "_blank", "noopener,noreferrer");
      if (!opened) {
        showToast(t("details.toast.openFail"), "error");
      }
    }
    if (action === "copy-url") {
      const href = actionButton.dataset.href;
      try {
        const copied = await copyToClipboard(href);
        showToast(
          t(copied ? "details.toast.copySuccess" : "details.toast.copyFail"),
          copied ? "success" : "error"
        );
      } catch (error) {
        showToast(t("details.toast.copyFail"), "error");
      }
    }
    if (action === "compare-add") {
      const href = actionButton.dataset.href;
      if (href) {
        toggleCompareUrl(href);
      }
    }
    return;
  }

  const tabButton = target.closest("button.details-metadata__tab");
  if (tabButton) {
    const href = tabButton.dataset.href;
    const tabKey = tabButton.dataset.tab;
    if (href && tabKey) {
      state.detailAccordionTabs.set(href, tabKey);
      scheduleDetailsRender();
    }
    return;
  }

  const toggleButton = target.closest("button.details-row__toggle");
  if (!toggleButton) {
    return;
  }

  const controlsId = toggleButton.getAttribute("aria-controls");
  if (!controlsId) {
    return;
  }

  const detailRow = document.getElementById(controlsId);
  if (!detailRow) {
    return;
  }

  const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
  const nextExpanded = !isExpanded;
  const href = toggleButton.dataset.href;
  state.detailExpandedUrl = nextExpanded && href ? href : null;
  toggleButton.setAttribute("aria-expanded", String(nextExpanded));
  detailRow.hidden = !nextExpanded;
  detailRow.classList.toggle("details-row__detail--visible", nextExpanded);
  if (nextExpanded) {
    if (href) {
      loadDetailMetadataForUrl(href);
    }
  }
}

function handleDetailsTabClick(event) {
  const button = event.currentTarget;
  if (!button) {
    return;
  }
  const tab = button.getAttribute("data-tab");
  detailsTabs.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("details__tab--active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });
  if (tab === "discovery") {
    if (detailsUrlPanel) {
      detailsUrlPanel.hidden = true;
    }
    if (detailsDiscoveryPanel) {
      detailsDiscoveryPanel.hidden = false;
    }
    if (detailsDiscoveryControls) {
      detailsDiscoveryControls.hidden = false;
    }
    if (detailsDiscoveryStatus) {
      detailsDiscoveryStatus.hidden = false;
    }
    if (detailsIssueSection) {
      detailsIssueSection.hidden = true;
    }
  } else {
    if (detailsUrlPanel) {
      detailsUrlPanel.hidden = false;
    }
    if (detailsDiscoveryPanel) {
      detailsDiscoveryPanel.hidden = true;
    }
    if (detailsDiscoveryControls) {
      detailsDiscoveryControls.hidden = true;
    }
    if (detailsDiscoveryStatus) {
      detailsDiscoveryStatus.hidden = true;
    }
    if (detailsIssueSection) {
      detailsIssueSection.hidden = false;
    }
  }
}

function parseXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("XML icerik okunamadi.");
  }
  return doc;
}

function buildSummary(doc, type) {
  let nodes = [];
  let dateExtractor = () => null;

  if (type === "urlset") {
    nodes = Array.from(doc.getElementsByTagName("url"));
    dateExtractor = (node) => {
      const lastmod = node.getElementsByTagName("lastmod")[0];
      return parseDate(lastmod ? lastmod.textContent : null);
    };
  } else if (type === "sitemapindex") {
    nodes = Array.from(doc.getElementsByTagName("sitemap"));
    dateExtractor = (node) => {
      const lastmod = node.getElementsByTagName("lastmod")[0];
      return parseDate(lastmod ? lastmod.textContent : null);
    };
  } else if (type === "rss") {
    nodes = Array.from(doc.getElementsByTagName("item"));
    dateExtractor = (node) => {
      const pubDate =
        node.getElementsByTagName("pubDate")[0] ||
        node.getElementsByTagName("dc:date")[0];
      return parseDate(pubDate ? pubDate.textContent : null);
    };
  } else if (type === "feed") {
    nodes = Array.from(doc.getElementsByTagName("entry"));
    dateExtractor = (node) => {
      const updated =
        node.getElementsByTagName("updated")[0] ||
        node.getElementsByTagName("published")[0];
      return parseDate(updated ? updated.textContent : null);
    };
  }

  const dates = nodes
    .map((node) => dateExtractor(node))
    .filter(Boolean);

  if (!dates.length) {
    return {
      type,
      count: nodes.length,
      latestDate: "Belirtilmemis",
      latestDateIso: null,
    };
  }

  const latest = new Date(Math.max(...dates.map((date) => date.getTime())));
  const latestIso = latest.toISOString();
  return {
    type,
    count: nodes.length,
    latestDate: formatDateTime(latestIso),
    latestDateIso: latestIso,
  };
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function updateUrlCountHeader(total) {
  if (!urlCountHeader) {
    return;
  }
  const safeTotal = typeof total === "number" && Number.isFinite(total) ? total : 0;
  const label = t("table.header.count");
  const { text, ariaLabel } = formatLabelWithCount(label, safeTotal);
  urlCountHeader.textContent = text;
  urlCountHeader.setAttribute("aria-label", ariaLabel);
}

function createActionButton({ icon, label, variant = "solid", onClick, disabled = false }) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("table__button");
  if (variant === "ghost") {
    button.classList.add("table__button--ghost");
  } else if (variant === "danger") {
    button.classList.add("table__button--danger");
  }
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });
  decorateButton(button, icon, label);
  if (disabled) {
    button.disabled = true;
  }
  return button;
}

function createSourceBadge(sourceType) {
  const badge = document.createElement("span");
  badge.classList.add("source-badge");
  const normalized = normalizeSourceType(sourceType);
  if (normalized === "rss") {
    badge.classList.add("source-badge--rss");
  } else {
    badge.classList.add("source-badge--sitemap");
  }
  badge.textContent = getSourceLabel(normalized);
  badge.setAttribute("data-source-type", normalized);
  return badge;
}

function createNotificationToggle(row) {
  const toggleWrapper = document.createElement("label");
  toggleWrapper.classList.add("toggle-switch");

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  toggleInput.classList.add("toggle-switch__input");
  toggleInput.checked = Boolean(row.notificationsEnabled);

  const toggleSlider = document.createElement("span");
  toggleSlider.classList.add("toggle-switch__slider");

  const toggleText = document.createElement("span");
  toggleText.classList.add("toggle-switch__label");
  toggleText.textContent = toggleInput.checked
    ? t("toggle.notifications.on")
    : t("toggle.notifications.off");

  const updateToggleState = (checked) => {
    toggleInput.checked = checked;
    toggleText.textContent = checked
      ? t("toggle.notifications.on")
      : t("toggle.notifications.off");
  };

  toggleWrapper.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  toggleInput.addEventListener("change", async (event) => {
    event.stopPropagation();
    const wantsEnabled = event.target.checked;
    const displayTitle = row.title || row.url;
    const urlValue = row.url;

    if (wantsEnabled) {
      let activation = { ok: true, changed: false };

      if (!notificationManager.isEnabled()) {
        const wantsEnable = window.confirm(
          "Tarayici bildirim izni verilmemis. Bu sitemap icin bildirim almak icin izin vermek ister misiniz?"
        );
        if (!wantsEnable) {
          updateToggleState(false);
          setStatus(t("notifications.error.denied"), "error");
          return;
        }
        activation = await notificationManager.enableNotifications({ silent: false });
      } else {
        activation = await notificationManager.ensureActive({ silent: true });
      }

      if (!activation.ok) {
        updateToggleState(false);
        setStatus(getNotificationErrorMessage(activation.reason));
        return;
      }

      const updated = setNotificationPreference(urlValue, true);
      if (!updated) {
        updateToggleState(false);
        return;
      }
      row.notificationsEnabled = true;
      updateToggleState(true);

      if (activation.changed) {
        setStatus(
          `${displayTitle} icin bildirimler acildi. Genel bildirimler de etkinlestirildi.`
        );
      } else {
        setStatus(`${displayTitle} icin bildirimler acildi.`);
      }
      return;
    }

    const updated = setNotificationPreference(urlValue, false);
    if (!updated) {
      updateToggleState(true);
      return;
    }
    row.notificationsEnabled = false;
    updateToggleState(false);
    setStatus(`${displayTitle} icin bildirimler kapatildi.`);
  });

  toggleWrapper.append(toggleInput, toggleSlider, toggleText);
  return toggleWrapper;
}

function createEmailConfig(row) {
  const emailConfig = document.createElement("div");
  emailConfig.classList.add("email-config");
  emailConfig.addEventListener("click", (event) => event.stopPropagation());

  const info = document.createElement("p");
  info.classList.add("email-config__info");
  info.textContent = "Her satira bir e-posta adresi olacak sekilde alicilari ekleyin.";
  emailConfig.appendChild(info);

  const textarea = document.createElement("textarea");
  textarea.classList.add("email-config__textarea");
  textarea.placeholder = "ornek@domain.com";
  textarea.value = (row.emailRecipients || []).join("\n");
  emailConfig.appendChild(textarea);

  const enableLabel = document.createElement("label");
  enableLabel.classList.add("email-config__toggle");
  const enableCheckbox = document.createElement("input");
  enableCheckbox.type = "checkbox";
  enableCheckbox.classList.add("email-config__checkbox");
  enableCheckbox.checked = Boolean(row.emailEnabled);
  const enableText = document.createElement("span");
  enableText.textContent = "E-posta bildirimleri aktif";
  enableLabel.append(enableCheckbox, enableText);
  emailConfig.appendChild(enableLabel);

  const actionRow = document.createElement("div");
  actionRow.classList.add("email-config__actions");

  const saveEmailButton = document.createElement("button");
  saveEmailButton.type = "button";
  saveEmailButton.classList.add("email-config__button");
  saveEmailButton.textContent = "Kaydet";
  saveEmailButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    commitEmailSettings(row.url, textarea.value, enableCheckbox.checked);
  });
  actionRow.appendChild(saveEmailButton);

  const cancelEmailButton = document.createElement("button");
  cancelEmailButton.type = "button";
  cancelEmailButton.classList.add("email-config__button", "email-config__button--ghost");
  cancelEmailButton.textContent = "Vazgec";
  cancelEmailButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    cancelEmailEdit();
  });
  actionRow.appendChild(cancelEmailButton);

  emailConfig.appendChild(actionRow);
  return emailConfig;
}

function createExpandedRow(row) {
  const expandedTr = document.createElement("tr");
  expandedTr.classList.add("table__expanded-row");

  const expandedTd = document.createElement("td");
  expandedTd.colSpan = 6;
  expandedTd.classList.add("table__expanded-cell");

  const expandedContent = document.createElement("div");
  expandedContent.classList.add("table__expanded-content");

  const urlSection = document.createElement("div");
  urlSection.classList.add("table__expanded-section");
  const urlLabel = document.createElement("div");
  urlLabel.classList.add("table__expanded-label");
  urlLabel.textContent = `${t("table.expanded.urlLabel")}:`;
  const urlLink = document.createElement("a");
  urlLink.href = row.url;
  urlLink.target = "_blank";
  urlLink.rel = "noopener noreferrer";
  urlLink.textContent = row.url;
  urlLink.classList.add("table__url", "table__link");
  urlSection.append(urlLabel, urlLink);
  expandedContent.appendChild(urlSection);

  const actionsSection = document.createElement("div");
  actionsSection.classList.add("table__expanded-section");
  const actionsLabel = document.createElement("div");
  actionsLabel.classList.add("table__expanded-label");
  actionsLabel.textContent = t("table.expanded.actions");
  const actionsWrapper = document.createElement("div");
  actionsWrapper.classList.add("table__expanded-actions");

  const notificationToggle = createNotificationToggle(row);
  actionsWrapper.appendChild(notificationToggle);

  const editButton = createActionButton({
    icon: "mdi:pencil-outline",
    label: t("button.edit"),
    variant: "ghost",
    onClick: () => enterEditMode(row.url),
  });
  actionsWrapper.appendChild(editButton);

  const emailSettingsButton = createActionButton({
    icon: "mdi:email-edit-outline",
    label: t("button.emailSettings"),
    variant: "ghost",
    onClick: () => {
      if (state.emailEditUrl === row.url) {
        cancelEmailEdit();
      } else {
        enterEmailEdit(row.url);
      }
    },
  });
  actionsWrapper.appendChild(emailSettingsButton);

  const testButton = createActionButton({
    icon: "mdi:bell-alert-outline",
    label: t("button.testNotification"),
    variant: "ghost",
    onClick: async () => {
      const displayTitle = row.title || row.url;
      const currentRow = state.rows.find((item) => item.url === row.url) || row;

      if (!currentRow.notificationsEnabled) {
        setStatus(t("status.notifications.enableFirst"), "error");
        return;
      }

      const activation = await notificationManager.ensureActive({ silent: true });
      if (!activation.ok) {
        setStatus(getNotificationErrorMessage(activation.reason), "error");
        return;
      }

      const sent = notificationManager.triggerTest(currentRow);
      if (sent) {
        setStatus(t("status.notification.testSent", { title: displayTitle }), "success");
      }
    },
  });
  actionsWrapper.appendChild(testButton);

  const emailTestButton = createActionButton({
    icon: "mdi:email-fast-outline",
    label: t("button.testEmail"),
    variant: "ghost",
    onClick: async (event) => {
      const displayTitle = row.title || row.url;
      const currentRow = state.rows.find((item) => item.url === row.url) || row;
      const recipients = sanitizeEmails(currentRow.emailRecipients);

      if (!recipients.length || !currentRow.emailEnabled) {
        setStatus(t("status.email.enableFirst"), "error");
        return;
      }

      const button = event.currentTarget;
      button.disabled = true;
      setStatus(t("status.email.sending", { title: displayTitle }), "info");
      try {
        const result = await sendEmailTest(currentRow);
        if (result && typeof result === "string") {
          setStatus(result, "success");
        } else if (result) {
          setStatus(t("status.email.sent", { title: displayTitle }), "success");
        }
      } finally {
        button.disabled = false;
      }
    },
  });
  actionsWrapper.appendChild(emailTestButton);

  const buildLinkMapButton = createActionButton({
    icon: "mdi:link-variant-plus",
    label: state.linkMapLoading.has(row.url)
      ? t("details.actions.linkMapCancel")
      : t("details.actions.linkMapBuild"),
    variant: "ghost",
    onClick: () => {
      if (state.linkMapLoading.has(row.url)) {
        cancelLinkMapForSitemap(row);
      } else {
        buildLinkMapForSitemap(row);
      }
    },
  });
  actionsWrapper.appendChild(buildLinkMapButton);

  const exportLinkMapButton = createActionButton({
    icon: "mdi:file-export-outline",
    label: t("details.actions.linkMapExport"),
    variant: "ghost",
    onClick: () => exportLinkMapForSitemap(row),
    disabled: !state.linkMapBySitemap.has(row.url),
  });
  actionsWrapper.appendChild(exportLinkMapButton);

  if (row.removable) {
    const removeButton = createActionButton({
      icon: "mdi:trash-can-outline",
      label: t("button.remove"),
      variant: "danger",
      onClick: () => confirmSitemapRemoval(row),
    });
    actionsWrapper.appendChild(removeButton);
  }

  actionsSection.append(actionsLabel, actionsWrapper);
  expandedContent.appendChild(actionsSection);

  const linkMapSection = document.createElement("div");
  linkMapSection.classList.add("table__expanded-section");
  linkMapSection.dataset.linkMapSitemap = row.url;
  const linkMapLabel = document.createElement("div");
  linkMapLabel.classList.add("table__expanded-label");
  linkMapLabel.textContent = t("table.expanded.linkMap");
  linkMapSection.appendChild(linkMapLabel);
  const linkMapJob = state.linkMapJobsBySitemap.get(row.url) || null;

  if (state.linkMapLoading.has(row.url)) {
    const loadingText = document.createElement("p");
    loadingText.classList.add("table__linkmap-summary", "table__linkmap-loading");
    loadingText.textContent = t("details.linkMap.building");
    linkMapSection.appendChild(loadingText);
    if (linkMapJob) {
      const percent = Math.max(0, Math.min(100, Number(linkMapJob.percent) || 0));
      const progressBar = document.createElement("div");
      progressBar.classList.add("table__linkmap-progress");
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", "100");
      progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));
      progressBar.setAttribute("aria-label", t("table.expanded.linkMap"));

      const progressFill = document.createElement("div");
      progressFill.classList.add("table__linkmap-progress-fill");
      progressFill.style.width = `${percent}%`;
      if (linkMapJob.status === "error") {
        progressFill.classList.add("table__linkmap-progress-fill--error");
      } else if (linkMapJob.status === "cancelled") {
        progressFill.classList.add("table__linkmap-progress-fill--cancelled");
      }
      progressBar.appendChild(progressFill);
      linkMapSection.appendChild(progressBar);
    }
    if (linkMapJob && (linkMapJob.total > 0 || linkMapJob.processed > 0)) {
      const progressText = document.createElement("p");
      progressText.classList.add("table__linkmap-summary", "table__linkmap-summary--progress");
      progressText.textContent = t("details.linkMap.progress", {
        processed: numberFormatter.format(linkMapJob.processed || 0),
        total: numberFormatter.format(linkMapJob.total || 0),
        percent: numberFormatter.format(linkMapJob.percent || 0),
      });
      linkMapSection.appendChild(progressText);
    }
    if (linkMapJob && Number.isFinite(Number(linkMapJob.etaSeconds)) && Number(linkMapJob.etaSeconds) > 0) {
      const etaText = document.createElement("p");
      etaText.classList.add("table__linkmap-summary", "table__linkmap-summary--eta");
      etaText.textContent = t("details.linkMap.eta", {
        seconds: numberFormatter.format(Number(linkMapJob.etaSeconds)),
      });
      linkMapSection.appendChild(etaText);
    }
  } else if (state.linkMapBySitemap.has(row.url)) {
    const payload = state.linkMapBySitemap.get(row.url) || {};
    const metrics = payload.metrics || {};
    const summary = document.createElement("p");
    summary.classList.add("table__linkmap-summary");
    summary.textContent = t("details.linkMap.summary", {
      pages: numberFormatter.format(Number(payload.totalUrls) || 0),
      links: numberFormatter.format(Number(metrics.totalLinks) || 0),
      orphans: numberFormatter.format(Number(metrics.orphanPages) || 0),
      failed: numberFormatter.format(Number(metrics.failedPages) || 0),
    });
    linkMapSection.appendChild(summary);

    const links = Array.isArray(payload.links) ? payload.links.slice(0, 10) : [];
    if (links.length) {
      const previewTitle = document.createElement("div");
      previewTitle.classList.add("table__linkmap-preview-title");
      previewTitle.textContent = t("details.linkMap.preview");
      linkMapSection.appendChild(previewTitle);

      const previewList = document.createElement("div");
      previewList.classList.add("table__linkmap-list");
      for (const entry of links) {
        const item = document.createElement("div");
        item.classList.add("table__linkmap-item");

        const pair = document.createElement("div");
        pair.classList.add("table__linkmap-pair");
        pair.textContent = `${formatLinkMapPreviewUrl(entry.sourceUrl)} -> ${formatLinkMapPreviewUrl(entry.targetUrl)}`;

        const meta = document.createElement("div");
        meta.classList.add("table__linkmap-meta");
        const anchorText = entry.anchorText ? entry.anchorText : "-";
        meta.textContent = `${anchorText} | x${numberFormatter.format(Number(entry.count) || 0)}`;

        item.append(pair, meta);
        previewList.appendChild(item);
      }
      linkMapSection.appendChild(previewList);
    } else {
      const emptyText = document.createElement("p");
      emptyText.classList.add("table__linkmap-summary");
      emptyText.textContent = t("details.linkMap.empty");
      linkMapSection.appendChild(emptyText);
    }
  } else {
    const emptyState = document.createElement("p");
    emptyState.classList.add("table__linkmap-summary");
    emptyState.textContent = t("details.linkMap.empty");
    linkMapSection.appendChild(emptyState);
  }
  expandedContent.appendChild(linkMapSection);

  if (state.emailEditUrl === row.url) {
    expandedContent.appendChild(createEmailConfig(row));
  }

  expandedTd.appendChild(expandedContent);
  expandedTr.appendChild(expandedTd);
  return expandedTr;
}

function renderTable() {
  tableBody.innerHTML = "";

  if (!state.rows.length) {
    updateUrlCountHeader(0);
    updateTablePaginationControls(1, 0, state.tablePerPage);
    tableBody.appendChild(createEmptyRow(t("table.noResults")));
    return;
  }

  const filteredRows = state.rows
    .filter((row) => {
      if (state.selectedDomain && row.domain !== state.selectedDomain) {
        return false;
      }
      return matchesNonDomainFilters(row);
    })
    .sort(sortByLatestDate);

  const totalUrlCount = filteredRows.reduce((sum, row) => {
    const value = typeof row.totalEntries === "number" ? row.totalEntries : Number(row.totalEntries);
    if (!Number.isFinite(value)) {
      return sum;
    }
    return sum + value;
  }, 0);
  updateUrlCountHeader(totalUrlCount);

  if (
    state.editingUrl &&
    !filteredRows.some((row) => row.url === state.editingUrl)
  ) {
    state.editingUrl = null;
  }

  if (
    state.tagInputUrl &&
    !filteredRows.some((row) => row.url === state.tagInputUrl)
  ) {
    state.tagInputUrl = null;
  }

  if (!filteredRows.length) {
    updateUrlCountHeader(0);
    state.tablePage = 1;
    updateTablePaginationControls(1, 0, state.tablePerPage);
    tableBody.appendChild(createEmptyRow(t("table.noResults")));
    return;
  }

  const totalFiltered = filteredRows.length;
  const totalPages = Math.ceil(totalFiltered / state.tablePerPage);
  if (state.tablePage > totalPages) {
    state.tablePage = totalPages;
  }
  if (state.tablePage < 1) {
    state.tablePage = 1;
  }
  const startIndex = (state.tablePage - 1) * state.tablePerPage;
  const endIndex = startIndex + state.tablePerPage;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);
  updateTablePaginationControls(state.tablePage, totalFiltered, state.tablePerPage);

  const maxDate = filteredRows.reduce((current, row) => {
    if (!row.latestDateIso) return current;
    const timestamp = new Date(row.latestDateIso).getTime();
    return Math.max(current, timestamp);
  }, 0);

  for (const row of paginatedRows) {
    const tr = document.createElement("tr");
    tr.dataset.url = row.url; // SatÃ„Â±rlarÃ„Â± URL ile tanÃ„Â±mla
    tr.dataset.sourceType = normalizeSourceType(row.sourceType);

    if (
      row.latestDateIso &&
      new Date(row.latestDateIso).getTime() === maxDate &&
      maxDate !== 0
    ) {
      tr.classList.add("table__highlight");
    }

    if (state.selected && state.selected.url === row.url) {
      tr.classList.add("table__selected");
    }

    const titleCell = document.createElement("td");
    const appendMetaRow = () => {
      const metaRow = document.createElement("div");
      metaRow.classList.add("table__meta");
      if (row.domain) {
        const domainBlock = document.createElement("span");
        domainBlock.classList.add("table__domain");
        domainBlock.textContent = row.domain;
        metaRow.appendChild(domainBlock);
      }
      metaRow.appendChild(createSourceBadge(row.sourceType));
      titleCell.appendChild(metaRow);
    };
    const isEditing = state.editingUrl === row.url;
    let editInput = null;

    if (isEditing) {
      const editWrapper = document.createElement("div");
      editWrapper.classList.add("table__edit");

      editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = row.title;
      editInput.placeholder = row.url;
      editInput.classList.add("table__edit-input");
      editWrapper.appendChild(editInput);
      titleCell.appendChild(editWrapper);

      editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitTitleChange(row.url, editInput.value);
        } else if (event.key === "Escape") {
          event.preventDefault();
          cancelEditMode();
        }
      });

      setTimeout(() => {
        if (editInput) {
          editInput.focus();
          editInput.select();
        }
      }, 0);

      appendMetaRow();

      titleCell.dataset.label = `DÃƒÂ¼zenleme modu ${row.title}`;
    } else {
      const titleBlock = document.createElement("div");
      titleBlock.classList.add("table__title");
      titleBlock.textContent = row.title;
      titleCell.appendChild(titleBlock);

      appendMetaRow();
    }

    tr.appendChild(titleCell);

    const tagsCell = document.createElement("td");
    const tagsWrapper = document.createElement("div");
    tagsWrapper.classList.add("table__tags");

    const tags = Array.isArray(row.tags) ? row.tags : [];
    if (tags.length) {
      for (const tag of tags) {
        const pill = document.createElement("span");
        pill.classList.add("tag-pill");
        pill.textContent = tag;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.classList.add("tag-pill__remove");
        remove.setAttribute("aria-label", t("tags.removeAria", { tag }));
        remove.textContent = "";
        remove.append(createIcon("mdi:close", 16));
        remove.addEventListener("click", () => {
          removeTag(row.url, tag);
        });
        pill.appendChild(remove);
        tagsWrapper.appendChild(pill);
      }
    } else {
      const emptySpan = document.createElement("span");
      emptySpan.classList.add("table__tags-empty");
      emptySpan.textContent = t("tags.empty");
      tagsWrapper.appendChild(emptySpan);
    }

    if (state.tagInputUrl === row.url) {
      const tagAdd = document.createElement("div");
      tagAdd.classList.add("tag-add");

      const popover = document.createElement("div");
      popover.classList.add("tag-add__popover");

      const title = document.createElement("h3");
      title.classList.add("tag-add__title");
      title.textContent = t("tags.addTitle");
      popover.appendChild(title);

      const chipWrapper = document.createElement("div");
      chipWrapper.classList.add("tag-add__chips");

      const availableTags = getAllTags().filter(
        (tag) => !tags.some((existing) => normalizeTag(existing) === normalizeTag(tag))
      );

      if (availableTags.length) {
        for (const chipTag of availableTags) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.classList.add("tag-add__chip");
          chip.textContent = chipTag;
          chip.addEventListener("click", () => {
            commitTagAddition(row.url, chipTag);
          });
          chipWrapper.appendChild(chip);
        }
      } else {
        const emptyChip = document.createElement("span");
        emptyChip.classList.add("table__tags-empty");
        emptyChip.textContent = t("tags.addEmpty");
        chipWrapper.appendChild(emptyChip);
      }

      popover.appendChild(chipWrapper);

      const fieldRow = document.createElement("div");
      fieldRow.classList.add("tag-add__field");

      const tagInput = document.createElement("input");
      tagInput.type = "text";
      tagInput.placeholder = t("tags.addPlaceholder");
      tagInput.classList.add("tag-add__input");
      fieldRow.appendChild(tagInput);

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.classList.add("tag-add__button");
      addButton.addEventListener("click", () => {
        commitTagAddition(row.url, tagInput.value);
      });
      decorateButton(addButton, "mdi:plus-circle-outline", t("button.tagCreate"));
      fieldRow.appendChild(addButton);

      popover.appendChild(fieldRow);

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.classList.add("tag-add__button", "tag-add__button--ghost");
      cancelButton.addEventListener("click", () => {
        cancelTagInput();
      });
      decorateButton(cancelButton, "mdi:close-circle-outline", t("button.tagCancel"));
      popover.appendChild(cancelButton);

      tagInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitTagAddition(row.url, tagInput.value);
        }
        if (event.key === "Escape") {
          event.preventDefault();
          cancelTagInput();
        }
      });

      setTimeout(() => {
        tagInput.focus();
      }, 0);

      tagAdd.appendChild(popover);
      tagsWrapper.appendChild(tagAdd);
    } else {
      const addTagButton = document.createElement("button");
      addTagButton.type = "button";
      addTagButton.classList.add("tag-add__button");
      addTagButton.addEventListener("click", () => {
        enterTagInput(row.url);
      });
      decorateButton(addTagButton, "mdi:tag-plus-outline", t("button.tagAdd"));
      tagsWrapper.appendChild(addTagButton);
    }

    tagsCell.appendChild(tagsWrapper);
    tr.appendChild(tagsCell);

    const countCell = document.createElement("td");
    const totalEntries =
      typeof row.totalEntries === "number" && Number.isFinite(row.totalEntries)
        ? numberFormatter.format(row.totalEntries)
        : "â€”";
    countCell.textContent = totalEntries;
    tr.appendChild(countCell);

    const updateRateCell = document.createElement("td");
    if (row.updateRate && row.updateRate.label) {
      const badge = document.createElement("span");
      badge.classList.add("update-rate-badge");

      if (row.updateRate.average >= 10) {
        badge.classList.add("update-rate-badge--high");
      } else if (row.updateRate.average >= 1) {
        badge.classList.add("update-rate-badge--medium");
      } else if (row.updateRate.average > 0) {
        badge.classList.add("update-rate-badge--low");
      } else {
        badge.classList.add("update-rate-badge--none");
      }

      badge.textContent = row.updateRate.label;
      badge.title = t("updateRate.tooltip", {
        total: numberFormatter.format(row.updateRate.total ?? 0),
      });
      updateRateCell.appendChild(badge);
    } else {
      updateRateCell.textContent = "â€”";
    }
    tr.appendChild(updateRateCell);

    const dateCell = document.createElement("td");
    dateCell.classList.add("table__date");
    if (row.error) {
      const typeTag = row.errorType ? `[${row.errorType}] ` : "";
      dateCell.textContent = `${t("table.errorPrefix")} ${typeTag}${row.error}`;
    } else {
      dateCell.textContent = row.latestDate;
    }
    tr.appendChild(dateCell);

    const actionCell = document.createElement("td");
    const actionWrapper = document.createElement("div");
    actionWrapper.classList.add("table__action");
    if (isEditing) {
      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.classList.add("table__button");
      saveButton.addEventListener("click", () => {
        commitTitleChange(row.url, editInput ? editInput.value : row.title);
      });
      decorateButton(saveButton, "mdi:content-save-outline", t("button.save"));
      actionWrapper.appendChild(saveButton);

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.classList.add("table__button", "table__button--ghost");
      cancelButton.addEventListener("click", () => {
        cancelEditMode();
      });
      decorateButton(cancelButton, "mdi:close-circle-outline", t("button.cancel"));
      actionWrapper.appendChild(cancelButton);
    } else {
      const viewButton = createActionButton({
        icon: "mdi:eye-outline",
        label: t("button.view"),
        onClick: () => showDetails(row),
      });
      actionWrapper.appendChild(viewButton);
    }

    actionCell.appendChild(actionWrapper);
    tr.appendChild(actionCell);

    // Accordion toggle iÃƒÂ§in satÃ„Â±ra tÃ„Â±klama eventi ekle
    tr.style.cursor = "pointer";
    tr.addEventListener("click", (event) => {
      // Buton tÃ„Â±klamalarÃ„Â±nÃ„Â± ignore et
      if (event.target.closest("button") || event.target.closest("input") || event.target.closest("a")) {
        return;
      }
      toggleRowExpansion(row.url);
    });

    tableBody.appendChild(tr);

    // EÃ„Å¸er bu satÃ„Â±r geniÃ…Å¸letilmiÃ…Å¸se, accordion iÃƒÂ§eriÃ„Å¸ini ekle (renderTable sonrasÃ„Â±nda)
    if (state.expandedRow === row.url) {
      tableBody.appendChild(createExpandedRow(row));
    }
  }
}

function toggleRowExpansion(url) {
  const wasExpanded = state.expandedRow === url;

  // Ãƒâ€“nce mevcut geniÃ…Å¸letilmiÃ…Å¸ satÃ„Â±rÃ„Â± kapat
  if (state.expandedRow) {
    const existingExpanded = tableBody.querySelector('.table__expanded-row');
    if (existingExpanded) {
      existingExpanded.remove();
    }
  }

  if (wasExpanded) {
    state.expandedRow = null;
  } else {
    state.expandedRow = url;
    loadDetailMetadataForUrl(url);
    loadSavedLinkMap(url);

    // Yeni satÃ„Â±rÃ„Â± ekle
    const row = state.rows.find(r => r.url === url);
    if (row) {
      // TÃ„Â±klanan satÃ„Â±rÃ„Â± bul
      const allRows = Array.from(tableBody.querySelectorAll('tr:not(.table__expanded-row)'));
      const rowIndex = state.rows
        .filter((r) => {
          if (state.selectedDomain && r.domain !== state.selectedDomain) {
            return false;
          }
          return matchesNonDomainFilters(r);
        })
        .sort(sortByLatestDate)
        .findIndex(r => r.url === url);

      if (rowIndex !== -1 && allRows[rowIndex]) {
        const expandedTr = createExpandedRow(row);
        // Satirdan sonra ekle
        allRows[rowIndex].after(expandedTr);
      }
    }
  }
}

function sortByLatestDate(a, b) {
  if (!a.latestDateIso && !b.latestDateIso) return 0;
  if (!a.latestDateIso) return 1;
  if (!b.latestDateIso) return -1;
  return new Date(b.latestDateIso).getTime() - new Date(a.latestDateIso).getTime();
}

function createEmptyRow(message = t("table.empty")) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 6;
  td.classList.add("empty-state");
  td.textContent = message;
  tr.appendChild(td);
  return tr;
}

function createSkeletonRow() {
  const tr = document.createElement("tr");
  tr.classList.add("skeleton-row");

  // Sitemap sÃƒÂ¼tunu
  const titleCell = document.createElement("td");
  const titleBox = document.createElement("div");
  titleBox.classList.add("skeleton-box", "skeleton-box--title");
  titleCell.appendChild(titleBox);
  tr.appendChild(titleCell);

  // Etiketler sÃƒÂ¼tunu
  const tagsCell = document.createElement("td");
  const tagBox = document.createElement("div");
  tagBox.classList.add("skeleton-box", "skeleton-box--tag");
  tagsCell.appendChild(tagBox);
  tr.appendChild(tagsCell);

  // URL SayÃ„Â±sÃ„Â± sÃƒÂ¼tunu
  const countCell = document.createElement("td");
  const countBox = document.createElement("div");
  countBox.classList.add("skeleton-box", "skeleton-box--count");
  countCell.appendChild(countBox);
  tr.appendChild(countCell);

  // Yenilenme sÃƒÂ¼tunu
  const rateCell = document.createElement("td");
  const rateBox = document.createElement("div");
  rateBox.classList.add("skeleton-box", "skeleton-box--rate");
  rateCell.appendChild(rateBox);
  tr.appendChild(rateCell);

  // Son GÃƒÂ¼ncelleme sÃƒÂ¼tunu
  const dateCell = document.createElement("td");
  const dateBox = document.createElement("div");
  dateBox.classList.add("skeleton-box", "skeleton-box--date");
  dateCell.appendChild(dateBox);
  tr.appendChild(dateCell);

  // Ã„Â°Ã…Å¸lemler sÃƒÂ¼tunu
  const actionsCell = document.createElement("td");
  const actionsBox = document.createElement("div");
  actionsBox.classList.add("skeleton-box--actions");
  for (let i = 0; i < 3; i++) {
    const buttonBox = document.createElement("div");
    buttonBox.classList.add("skeleton-box", "skeleton-box--button");
    actionsBox.appendChild(buttonBox);
  }
  actionsCell.appendChild(actionsBox);
  tr.appendChild(actionsCell);

  return tr;
}

function showSkeletonLoader(count = 3) {
  tableBody.innerHTML = "";
  for (let i = 0; i < count; i++) {
    tableBody.appendChild(createSkeletonRow());
  }
}

function createDetailSkeletonRow() {
  const tr = document.createElement("tr");
  tr.classList.add("skeleton-row");

  // BaÃ„Å¸lantÃ„Â± sÃƒÂ¼tunu
  const linkCell = document.createElement("td");
  const linkBox = document.createElement("div");
  linkBox.classList.add("skeleton-box");
  linkBox.style.width = "70%";
  linkCell.appendChild(linkBox);
  tr.appendChild(linkCell);

  // Son GÃƒÂ¼ncelleme sÃƒÂ¼tunu
  const dateCell = document.createElement("td");
  const dateBox = document.createElement("div");
  dateBox.classList.add("skeleton-box", "skeleton-box--date");
  dateCell.appendChild(dateBox);
  tr.appendChild(dateCell);

  return tr;
}

function showDetailSkeletonLoader(count = 5) {
  detailsTableBody.innerHTML = "";
  for (let i = 0; i < count; i++) {
    detailsTableBody.appendChild(createDetailSkeletonRow());
  }
}

async function showDetails(row) {
  state.selected = row;
  state.detailFilters = { from: "", to: "" };
  state.detailEntries = [];
  state.detailType = null;
  state.detailPrefixFilter = null;
  state.detailPrefixSummary = [];
  state.detailPrefixTotal = 0;
  state.detailIssueSummary = [];
  state.detailIssueFilter = null;
  state.detailIssueTotal = 0;
  state.detailHasMoreGroups = false;
  state.isLoadingDetails = false;
  dateFromInput.value = "";
  dateToInput.value = "";
  state.detailMetadata = new Map();
  state.detailExpandedUrl = null;
  state.detailAccordionTabs = new Map();
  resetDetailScanState({ preserveLast: true });
  renderDetailPrefixMenu();

  // Titremeyi ÃƒÂ¶nlemek iÃƒÂ§in renderTable() yerine manuel seÃƒÂ§im yap
  const allRows = tableBody.querySelectorAll("tr");
  allRows.forEach(tr => {
    if (tr.dataset.url === row.url) {
      tr.classList.add("table__selected");
    } else {
      tr.classList.remove("table__selected");
    }
  });

  if (row.error) {
    renderDetails();
    setDetailStatus(t("details.status.loadError", { error: state.selected.error }));
    return;
  }

  state.isLoadingDetails = true;
  renderDetails();
  setDetailStatus(t("details.status.loading", { title: row.title || row.url }));

  try {
    const xmlText = row.rawXml ?? (await fetchSitemapText(row.url));
    row.rawXml = xmlText;
    const details = parseSitemapEntries(xmlText, row.url);
    state.detailEntries = details.entries;
    state.detailType = details.type;
    row.error = null;
    row.rootType = details.type;
    row.totalEntries = details.summary.count;
    row.latestDate = details.summary.latestDate;
    row.latestDateIso = details.summary.latestDateIso;
    row.recentEntries = Array.isArray(details.recentEntries)
      ? details.recentEntries
      : deriveRecentEntries(details.entries, 8);
    setDetailStatus(t("details.status.loadedCount", { count: numberFormatter.format(details.entries.length) }));
    await Promise.all([loadLatestScanResults(row.url), loadSavedLinkMap(row.url)]);
    applyLinkMapStatusesToDetailEntries(row.url);
  } catch (error) {
    console.error(`"${row.title}" detaylarÃ„Â± yÃƒÂ¼klenemedi:`, error);
    row.error = error.message || "Bilinmeyen hata";
    row.errorType = error && error.fetchErrorType ? error.fetchErrorType : null;
    row.errorCode = error && error.fetchErrorCode ? error.fetchErrorCode : null;
    row.rawXml = null;
    row.rootType = "error";
    row.totalEntries = 0;
    row.latestDate = t("datetime.unknown");
    row.latestDateIso = null;
    state.detailEntries = [];
    state.detailType = null;
    setDetailStatus(t("details.status.fetchError", { error: row.error }));


  } finally {
    state.isLoadingDetails = false;
    renderDetails();
  }
}

async function showDomainDetails(domain) {
  if (!domain) {
    return;
  }
  state.selected = {
    title: domain,
    url: domain,
    domain,
    isDomainAggregate: true,
  };
  state.detailFilters = { from: "", to: "" };
  state.detailEntries = [];
  state.detailType = "domain";
  state.detailPrefixFilter = null;
  state.detailPrefixSummary = [];
  state.detailPrefixTotal = 0;
  state.detailIssueSummary = [];
  state.detailIssueFilter = null;
  state.detailIssueTotal = 0;
  state.detailHasMoreGroups = false;
  state.isLoadingDetails = false;
  dateFromInput.value = "";
  dateToInput.value = "";
  state.detailMetadata = new Map();
  state.detailExpandedUrl = null;
  state.detailAccordionTabs = new Map();
  resetDetailScanState({ preserveLast: true });
  renderDetailPrefixMenu();

  const allRows = tableBody.querySelectorAll("tr");
  allRows.forEach((tr) => tr.classList.remove("table__selected"));

  state.isLoadingDetails = true;
  renderDetails();
  setDetailStatus(t("details.status.loading", { title: domain }));

  const domainRows = state.rows.filter((row) => row.domain === domain && !row.error);
  if (!domainRows.length) {
    state.detailEntries = [];
    state.detailType = "domain";
    state.isLoadingDetails = false;
    renderDetails();
    setDetailStatus(t("details.status.noData"));
    return;
  }

  const entries = [];
  for (const row of domainRows) {
    try {
      const xmlText = row.rawXml ?? (await fetchSitemapText(row.url));
      row.rawXml = xmlText;
      const details = parseSitemapEntries(xmlText, row.url);
      if (Array.isArray(details.entries)) {
        entries.push(...details.entries);
      }
    } catch (error) {
      console.warn(`"${row.title || row.url}" domain detaylari yüklenemedi:`, error);
    }
  }

  const seen = new Set();
  const uniqueEntries = entries.filter((entry) => {
    if (!entry || !entry.href) {
      return false;
    }
    const key = entry.href.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  state.detailEntries = uniqueEntries;
  state.detailType = "domain";
  state.isLoadingDetails = false;
  renderDetails();
  setDetailStatus(
    t("details.status.loadedCount", { count: numberFormatter.format(uniqueEntries.length) })
  );
}

function toggleCompareUrl(url) {
  if (!url) {
    return;
  }
  const list = Array.isArray(state.detailCompare) ? [...state.detailCompare] : [];
  const existingIndex = list.findIndex((item) => item && item.url === url);
  if (existingIndex !== -1) {
    list.splice(existingIndex, 1);
    if (state.detailComparePanelVisible && list.length < COMPARE_MIN_ITEMS) {
      state.detailComparePanelVisible = false;
    }
  } else {
    if (list.length >= COMPARE_MAX_ITEMS) {
      list.shift();
    }
    const entry = state.detailEntries.find((item) => item && item.href === url);
    const meta = state.detailMetadata instanceof Map ? state.detailMetadata.get(url) : null;
    list.push({
      url,
      statusCode:
        entry && Number.isFinite(Number(entry.statusCode)) ? Number(entry.statusCode) : null,
      title: (entry && entry.title) || (meta && meta.title) || "",
      description: (entry && entry.description) || (meta && meta.description) || "",
      paragraphs: (meta && meta.paragraphs) || [],
      schemaTypes: (meta && meta.schemaTypes) || [],
      headings: (meta && meta.headings) || [],
      layout: (meta && meta.layout) || [],
      schema: (meta && meta.schema) || [],
    });
    loadDetailMetadataForUrl(url);
  }
  state.detailCompare = list;
  renderComparePanel();
}

function ensureCompareUi() {
  let bar = document.getElementById("detailsCompareBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "detailsCompareBar";
    bar.classList.add("details-compare__bar");
    bar.hidden = true;
    bar.style.display = "none";
    const list = document.createElement("div");
    list.id = "detailsCompareBarList";
    list.classList.add("details-compare__bar-list");
    const actions = document.createElement("div");
    actions.classList.add("details-compare__bar-actions");
    const clear = document.createElement("button");
    clear.id = "detailsCompareBarClear";
    clear.type = "button";
    clear.classList.add("details-compare__bar-clear");
    clear.textContent = t("details.compare.clear");
    const button = document.createElement("button");
    button.id = "detailsCompareBarButton";
    button.type = "button";
    button.classList.add("details-compare__bar-button");
    button.disabled = true;
    button.textContent = t("details.compare.cta.waiting");
    actions.append(clear, button);
    bar.append(list, actions);
    document.body.appendChild(bar);
  }
  if (bar.parentElement !== document.body) {
    document.body.appendChild(bar);
  }
  bar.style.position = "fixed";
  bar.style.left = "0";
  bar.style.right = "0";
  bar.style.bottom = "0";
  bar.style.width = "min(1000px, calc(100% - 2rem))";
  bar.style.margin = "0 auto 1rem";
  bar.style.zIndex = "99999";
  if (!document.getElementById("detailsCompareBarList")) {
    const list = document.createElement("div");
    list.id = "detailsCompareBarList";
    list.classList.add("details-compare__bar-list");
    bar.appendChild(list);
  }
  let actions = bar.querySelector(".details-compare__bar-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.classList.add("details-compare__bar-actions");
    bar.appendChild(actions);
  }
  if (!document.getElementById("detailsCompareBarClear")) {
    const clear = document.createElement("button");
    clear.id = "detailsCompareBarClear";
    clear.type = "button";
    clear.classList.add("details-compare__bar-clear");
    clear.textContent = t("details.compare.clear");
    actions.appendChild(clear);
  }
  if (!document.getElementById("detailsCompareBarButton")) {
    const button = document.createElement("button");
    button.id = "detailsCompareBarButton";
    button.type = "button";
    button.classList.add("details-compare__bar-button");
    button.disabled = true;
    button.textContent = t("details.compare.cta.waiting");
    actions.appendChild(button);
  }

  let modal = document.getElementById("detailsCompareModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "detailsCompareModal";
    modal.classList.add("details-compare__modal");
    modal.hidden = true;

    const dialog = document.createElement("div");
    dialog.id = "detailsCompareModalContent";
    dialog.classList.add("details-compare__modal-dialog");

    const header = document.createElement("div");
    header.classList.add("details-compare__modal-header");
    const title = document.createElement("h3");
    title.classList.add("details-compare__title");
    title.textContent = t("details.compare.title");
    const actions = document.createElement("div");
    actions.classList.add("details-compare__modal-actions");
    const clear = document.createElement("button");
    clear.id = "detailsCompareClear";
    clear.type = "button";
    clear.classList.add("details-compare__clear");
    clear.textContent = t("details.compare.clear");
    const close = document.createElement("button");
    close.id = "detailsCompareClose";
    close.type = "button";
    close.classList.add("details-compare__close");
    close.textContent = t("details.compare.close");
    actions.append(clear, close);
    header.append(title, actions);

    const cards = document.createElement("div");
    cards.id = "detailsCompareCards";
    cards.classList.add("details-compare__cards");
    const summary = document.createElement("div");
    summary.id = "detailsCompareSummary";
    summary.classList.add("details-compare__summary");

    dialog.append(header, cards, summary);
    modal.appendChild(dialog);
    document.body.appendChild(modal);
  }
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }
  let dialog = document.getElementById("detailsCompareModalContent");
  if (!dialog) {
    dialog = document.createElement("div");
    dialog.id = "detailsCompareModalContent";
    dialog.classList.add("details-compare__modal-dialog");
    modal.appendChild(dialog);
  }

  let header = dialog.querySelector(".details-compare__modal-header");
  if (!header) {
    header = document.createElement("div");
    header.classList.add("details-compare__modal-header");
    const title = document.createElement("h3");
    title.classList.add("details-compare__title");
    title.textContent = t("details.compare.title");
    const actions = document.createElement("div");
    actions.classList.add("details-compare__modal-actions");
    const clear = document.createElement("button");
    clear.id = "detailsCompareClear";
    clear.type = "button";
    clear.classList.add("details-compare__clear");
    clear.textContent = t("details.compare.clear");
    const close = document.createElement("button");
    close.id = "detailsCompareClose";
    close.type = "button";
    close.classList.add("details-compare__close");
    close.textContent = t("details.compare.close");
    actions.append(clear, close);
    header.append(title, actions);
    dialog.prepend(header);
  }

  if (!document.getElementById("detailsCompareCards")) {
    const cards = document.createElement("div");
    cards.id = "detailsCompareCards";
    cards.classList.add("details-compare__cards");
    dialog.appendChild(cards);
  }
  if (!document.getElementById("detailsCompareSummary")) {
    const summary = document.createElement("div");
    summary.id = "detailsCompareSummary";
    summary.classList.add("details-compare__summary");
    dialog.appendChild(summary);
  }

  const clearButton = document.getElementById("detailsCompareClear");
  const barClearButton = document.getElementById("detailsCompareBarClear");
  const closeButton = document.getElementById("detailsCompareClose");
  const barButton = document.getElementById("detailsCompareBarButton");

  if (clearButton && !clearButton.dataset.bound) {
    clearButton.dataset.bound = "true";
    clearButton.addEventListener("click", () => {
      state.detailCompare = [];
      state.detailComparePanelVisible = false;
      renderComparePanel();
    });
  }
  if (closeButton && !closeButton.dataset.bound) {
    closeButton.dataset.bound = "true";
    closeButton.addEventListener("click", () => {
      state.detailComparePanelVisible = false;
      renderComparePanel();
    });
  }
  if (barClearButton && !barClearButton.dataset.bound) {
    barClearButton.dataset.bound = "true";
    barClearButton.addEventListener("click", () => {
      state.detailCompare = [];
      state.detailComparePanelVisible = false;
      renderComparePanel();
    });
  }
  if (modal && !modal.dataset.bound) {
    modal.dataset.bound = "true";
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        state.detailComparePanelVisible = false;
        renderComparePanel();
      }
    });
  }
  if (barButton && !barButton.dataset.bound) {
    barButton.dataset.bound = "true";
    barButton.addEventListener("click", () => {
      if (
        Array.isArray(state.detailCompare) &&
        state.detailCompare.length >= COMPARE_MIN_ITEMS
      ) {
        state.detailComparePanelVisible = true;
        renderComparePanel();
      }
    });
  }

  return {
    bar,
    barList: document.getElementById("detailsCompareBarList"),
    barButton,
    barClear: document.getElementById("detailsCompareBarClear"),
    modal,
    cards: document.getElementById("detailsCompareCards"),
    summary: document.getElementById("detailsCompareSummary"),
  };
}

function computeLayoutStats(layout) {
  if (!Array.isArray(layout) || !layout.length) {
    return { count: 0, depth: 0 };
  }
  let count = 0;
  let maxDepth = 0;
  const walk = (nodes, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    nodes.forEach((node) => {
      if (!node) {
        return;
      }
      count += 1;
      if (Array.isArray(node.children) && node.children.length) {
        walk(node.children, depth + 1);
      }
    });
  };
  walk(layout, 1);
  return { count, depth: maxDepth };
}

function normalizeCompareParagraph(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function computeParagraphDiff(sourceParagraphs, targetParagraphs) {
  const sourceMap = new Map();
  const targetMap = new Map();
  const toMap = (values, map) => {
    if (!Array.isArray(values)) {
      return;
    }
    values.forEach((value) => {
      if (typeof value !== "string") {
        return;
      }
      const normalized = normalizeCompareParagraph(value);
      if (!normalized || map.has(normalized)) {
        return;
      }
      map.set(normalized, value.replace(/\s+/g, " ").trim());
    });
  };

  toMap(sourceParagraphs, sourceMap);
  toMap(targetParagraphs, targetMap);

  const removed = [];
  const added = [];
  let same = 0;

  sourceMap.forEach((original, normalized) => {
    if (targetMap.has(normalized)) {
      same += 1;
      return;
    }
    removed.push(original);
  });
  targetMap.forEach((original, normalized) => {
    if (!sourceMap.has(normalized)) {
      added.push(original);
    }
  });

  return { added, removed, same };
}

function buildCompareContentDiff(diff) {
  const section = document.createElement("section");
  section.classList.add("details-compare__content-diff");

  const title = document.createElement("h4");
  title.classList.add("details-compare__content-title");
  title.textContent = t("details.compare.content.title");
  section.appendChild(title);

  const summary = document.createElement("p");
  summary.classList.add("details-compare__content-summary");
  summary.textContent = t("details.compare.content.summary", {
    added: diff.added.length,
    removed: diff.removed.length,
    same: diff.same,
  });
  section.appendChild(summary);

  if (!diff.added.length && !diff.removed.length) {
    const empty = document.createElement("p");
    empty.classList.add("details-compare__content-empty");
    empty.textContent = t("details.compare.content.none");
    section.appendChild(empty);
    return section;
  }

  const groups = document.createElement("div");
  groups.classList.add("details-compare__content-groups");

  const buildGroup = (items, tone, labelKey) => {
    const group = document.createElement("div");
    group.classList.add("details-compare__content-group");

    const label = document.createElement("p");
    label.classList.add("details-compare__content-group-title");
    label.textContent = labelKey;
    group.appendChild(label);

    if (!items.length) {
      const none = document.createElement("p");
      none.classList.add("details-compare__content-empty");
      none.textContent = "-";
      group.appendChild(none);
      return group;
    }

    const list = document.createElement("ul");
    list.classList.add("details-compare__content-list");
    items.slice(0, COMPARE_CONTENT_DIFF_PREVIEW_LIMIT).forEach((text) => {
      const item = document.createElement("li");
      item.classList.add("details-compare__content-item");
      item.classList.add(`details-compare__content-item--${tone}`);
      item.textContent = text;
      list.appendChild(item);
    });
    group.appendChild(list);

    const hiddenCount = items.length - COMPARE_CONTENT_DIFF_PREVIEW_LIMIT;
    if (hiddenCount > 0) {
      const more = document.createElement("p");
      more.classList.add("details-compare__content-more");
      more.textContent = t("details.compare.content.more", { count: hiddenCount });
      group.appendChild(more);
    }

    return group;
  };

  groups.appendChild(buildGroup(diff.added, "added", t("details.compare.content.added")));
  groups.appendChild(buildGroup(diff.removed, "removed", t("details.compare.content.removed")));
  section.appendChild(groups);

  return section;
}

function formatCompareColumnLabel(data, index) {
  const fallback = `#${index + 1}`;
  const raw = (data && (data.title || data.url)) || fallback;
  const text = String(raw).replace(/\s+/g, " ").trim() || fallback;
  return text.length <= 32 ? text : `${text.slice(0, 29)}...`;
}

function buildCompareMetricsMatrix(dataList) {
  const section = document.createElement("section");
  section.classList.add("details-compare__matrix-section");

  const title = document.createElement("h4");
  title.classList.add("details-compare__matrix-title");
  title.textContent = t("details.compare.matrix.title");
  section.appendChild(title);

  const table = document.createElement("table");
  table.classList.add("details-compare__matrix");

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const metricHead = document.createElement("th");
  metricHead.textContent = t("details.compare.matrix.metric");
  headRow.appendChild(metricHead);
  dataList.forEach((data, index) => {
    const th = document.createElement("th");
    th.textContent = formatCompareColumnLabel(data, index);
    th.title = data.url || "";
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const metricRows = [
    {
      label: t("details.compare.metrics.status"),
      values: dataList.map((data) =>
        Number.isFinite(Number(data.statusCode)) ? String(Number(data.statusCode)) : "-"
      ),
      numeric: false,
    },
    {
      label: t("details.compare.metrics.headings"),
      values: dataList.map((data) => data.headingsCount),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.links"),
      values: dataList.map((data) => data.linksCount),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.schema"),
      values: dataList.map((data) => data.schemaCount),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.schemaTypes"),
      values: dataList.map((data) => data.schemaTypes.length),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.layoutDepth"),
      values: dataList.map((data) => data.layoutDepth),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.layoutCount"),
      values: dataList.map((data) => data.layoutCount),
      numeric: true,
    },
    {
      label: t("details.compare.metrics.paragraphs"),
      values: dataList.map((data) => data.paragraphCount),
      numeric: true,
    },
  ];

  const tbody = document.createElement("tbody");
  metricRows.forEach((row) => {
    const tr = document.createElement("tr");
    const labelCell = document.createElement("th");
    labelCell.textContent = row.label;
    tr.appendChild(labelCell);

    const numericValues = row.numeric
      ? row.values
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value))
      : [];
    const maxValue = numericValues.length ? Math.max(...numericValues) : null;

    row.values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = Number.isFinite(Number(value)) ? String(Number(value)) : String(value);
      if (row.numeric && maxValue != null && Number(value) === maxValue && maxValue > 0) {
        cell.classList.add("details-compare__matrix-cell--best");
      }
      tr.appendChild(cell);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  section.appendChild(table);
  return section;
}

function buildCompareSchemaMatrix(dataList) {
  const section = document.createElement("section");
  section.classList.add("details-compare__matrix-section");

  const title = document.createElement("h4");
  title.classList.add("details-compare__matrix-title");
  title.textContent = t("details.compare.schema.title");
  section.appendChild(title);

  const unionTypes = new Set();
  dataList.forEach((data) => {
    const schemaTypes = Array.isArray(data.schemaTypes) ? data.schemaTypes : [];
    schemaTypes.forEach((type) => {
      if (type) {
        unionTypes.add(type);
      }
    });
  });

  const typeList = Array.from(unionTypes).sort((a, b) => a.localeCompare(b));
  if (!typeList.length) {
    const empty = document.createElement("p");
    empty.classList.add("details-compare__content-empty");
    empty.textContent = t("details.compare.schema.none");
    section.appendChild(empty);
    return section;
  }

  const table = document.createElement("table");
  table.classList.add("details-compare__matrix");

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const typeHead = document.createElement("th");
  typeHead.textContent = t("details.compare.schema.present");
  headRow.appendChild(typeHead);
  dataList.forEach((data, index) => {
    const th = document.createElement("th");
    th.textContent = formatCompareColumnLabel(data, index);
    th.title = data.url || "";
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  typeList.forEach((type) => {
    const tr = document.createElement("tr");
    const labelCell = document.createElement("th");
    labelCell.textContent = type;
    tr.appendChild(labelCell);
    dataList.forEach((data) => {
      const td = document.createElement("td");
      const hasType =
        Array.isArray(data.schemaTypes) &&
        data.schemaTypes.some((entry) => normalizeSchemaTypeValue(entry) === normalizeSchemaTypeValue(type));
      td.textContent = hasType ? "✓" : "-";
      if (hasType) {
        td.classList.add("details-compare__matrix-cell--best");
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  section.appendChild(table);
  return section;
}

function buildCompareCard(data) {
  const card = document.createElement("div");
  card.classList.add("details-compare__card");

  const header = document.createElement("div");
  header.classList.add("details-compare__card-header");
  const title = document.createElement("div");
  title.classList.add("details-compare__card-title");
  title.textContent = data.title || data.url;
  header.appendChild(title);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.classList.add("details-compare__remove");
  remove.textContent = t("details.compare.remove");
  remove.addEventListener("click", () => toggleCompareUrl(data.url));
  header.appendChild(remove);
  card.appendChild(header);

  const link = document.createElement("a");
  link.classList.add("details-compare__link");
  link.href = data.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = data.url;
  card.appendChild(link);

  const list = document.createElement("dl");
  list.classList.add("details-compare__list");
  const addRow = (label, value) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.appendChild(dt);
    list.appendChild(dd);
  };

  addRow(t("details.compare.metrics.headings"), String(data.headingsCount));
  addRow(t("details.compare.metrics.links"), String(data.linksCount));
  addRow(
    t("details.compare.metrics.status"),
    Number.isFinite(Number(data.statusCode)) ? String(Number(data.statusCode)) : "-"
  );
  addRow(t("details.compare.metrics.schema"), String(data.schemaCount));
  addRow(t("details.compare.metrics.schemaTypes"), String(data.schemaTypes.length));
  addRow(t("details.compare.metrics.layoutDepth"), String(data.layoutDepth));
  addRow(t("details.compare.metrics.layoutCount"), String(data.layoutCount));
  addRow(t("details.compare.metrics.paragraphs"), String(data.paragraphCount));
  addRow(
    t("details.compare.metrics.description"),
    data.description ? data.description : "-"
  );

  card.appendChild(list);

  const schemaTypes = Array.isArray(data.schemaTypes) ? data.schemaTypes : [];
  const schemaTypeSection = document.createElement("div");
  schemaTypeSection.classList.add("details-compare__schema-types");
  const schemaTypeLabel = document.createElement("p");
  schemaTypeLabel.classList.add("details-compare__schema-types-label");
  schemaTypeLabel.textContent = t("details.compare.metrics.schemaTypes");
  schemaTypeSection.appendChild(schemaTypeLabel);
  if (schemaTypes.length) {
    const typeList = document.createElement("div");
    typeList.classList.add("details-compare__schema-types-list");
    schemaTypes.forEach((type) => {
      if (!type) {
        return;
      }
      const badge = document.createElement("span");
      badge.classList.add("details-compare__schema-type");
      badge.textContent = type;
      typeList.appendChild(badge);
    });
    schemaTypeSection.appendChild(typeList);
  } else {
    const empty = document.createElement("p");
    empty.classList.add("details-compare__content-empty");
    empty.textContent = t("details.compare.schema.none");
    schemaTypeSection.appendChild(empty);
  }
  card.appendChild(schemaTypeSection);

  if (Array.isArray(data.headings) && data.headings.length) {
    const headingList = document.createElement("ul");
    headingList.classList.add("details-compare__headings");
    data.headings.forEach((heading) => {
      if (!heading || !heading.text) {
        return;
      }
      const item = document.createElement("li");
      item.classList.add("details-compare__heading-item");
      const level =
        typeof heading.level === "number" && Number.isFinite(heading.level)
          ? `H${heading.level}`
          : "";
      item.textContent = level ? `${level} ${heading.text}` : heading.text;
      const links = Array.isArray(heading.links) ? heading.links : [];
      if (links.length) {
        const linkList = document.createElement("ul");
        linkList.classList.add("details-compare__heading-links");
        links.forEach((link) => {
          if (!link || !link.href) {
            return;
          }
          const linkItem = document.createElement("li");
          linkItem.classList.add("details-compare__heading-link-item");
          const anchor = document.createElement("a");
          anchor.classList.add("details-compare__heading-link");
          anchor.href = link.href;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.textContent = link.text || link.href;
          linkItem.appendChild(anchor);
          linkList.appendChild(linkItem);
        });
        item.appendChild(linkList);
      }
      headingList.appendChild(item);
    });
    card.appendChild(headingList);
  }
  return card;
}

function renderComparePanel() {
  const ui = ensureCompareUi();
  const items = Array.isArray(state.detailCompare) ? state.detailCompare : [];
  if (!items.length) {
    ui.modal.hidden = true;
    ui.cards.innerHTML = "";
    ui.summary.innerHTML = "";
    ui.bar.hidden = true;
    return;
  }

  ui.bar.hidden = false;
  ui.bar.style.display = "flex";
  ui.barList.innerHTML = "";
  items.forEach((item) => {
    const url = item && item.url ? item.url : "";
    const label = (item && item.title) || url;
    const pill = document.createElement("span");
    pill.classList.add("details-compare__pill");
    const pillText = document.createElement("span");
    pillText.textContent = label;
    pill.appendChild(pillText);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.classList.add("details-compare__pill-remove");
    remove.textContent = "×";
    remove.addEventListener("click", () => toggleCompareUrl(url));
    pill.appendChild(remove);
    ui.barList.appendChild(pill);
  });
  const ready = items.length >= COMPARE_MIN_ITEMS;
  ui.barButton.disabled = !ready;
  ui.barButton.textContent = ready
    ? t("details.compare.cta.ready")
    : t("details.compare.cta.waiting");
  if (ui.barClear) {
    ui.barClear.disabled = items.length === 0;
  }

  ui.modal.hidden = !state.detailComparePanelVisible;
  ui.cards.innerHTML = "";
  ui.summary.innerHTML = "";

  const dataList = items.map((item) => {
    const url = item && item.url ? item.url : "";
    const headings = item && Array.isArray(item.headings) ? item.headings : [];
    const schemaBlocks = item && Array.isArray(item.schema) ? item.schema : [];
    const schemaTypesRaw =
      item && Array.isArray(item.schemaTypes) && item.schemaTypes.length
        ? item.schemaTypes
        : extractSchemaTypes(schemaBlocks);
    const schemaTypes = Array.from(
      new Set(
        schemaTypesRaw
          .map((value) => normalizeSchemaTypeValue(value))
          .filter((value) => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
    const layout = item && Array.isArray(item.layout) ? item.layout : [];
    const paragraphs = item && Array.isArray(item.paragraphs) ? item.paragraphs : [];
    const linksCount = headings.reduce((total, heading) => {
      const links = heading && Array.isArray(heading.links) ? heading.links : [];
      return total + links.length;
    }, 0);
    const layoutStats = computeLayoutStats(layout);
    return {
      url,
      title: (item && item.title) || "",
      description: (item && item.description) || "",
      statusCode:
        item && Number.isFinite(Number(item.statusCode)) ? Number(item.statusCode) : null,
      headingsCount: headings.length,
      headings,
      linksCount,
      schemaCount: schemaBlocks.length,
      schemaTypes,
      layoutDepth: layoutStats.depth,
      layoutCount: layoutStats.count,
      paragraphCount: paragraphs.length,
      paragraphs,
    };
  });

  if (!ui.modal.hidden) {
    dataList.forEach((data) => {
      ui.cards.appendChild(buildCompareCard(data));
    });
  }

  if (!ui.modal.hidden && dataList.length >= COMPARE_MIN_ITEMS) {
    const summary = document.createElement("div");
    summary.classList.add("details-compare__summary");
    summary.appendChild(buildCompareMetricsMatrix(dataList));
    summary.appendChild(buildCompareSchemaMatrix(dataList));
    if (dataList.length === 2) {
      const paragraphDiff = computeParagraphDiff(dataList[0].paragraphs, dataList[1].paragraphs);
      summary.appendChild(buildCompareContentDiff(paragraphDiff));
    }
    ui.summary.appendChild(summary);
  }
}

async function loadLatestScanResults(sitemapUrl) {
  if (!sitemapUrl) {
    return;
  }
  try {
    const response = await fetch(
      `${API_SCAN_LATEST_ENDPOINT}?url=${encodeURIComponent(sitemapUrl)}`
    );
    if (!response.ok) {
      return;
    }
    const payload = await response.json().catch(() => null);
    if (!payload) {
      return;
    }
    applyLatestScanResults(payload);
  } catch (error) {
    console.warn("Latest scan results could not be loaded:", error);
  }
}

function applyLatestScanResults(payload) {
  if (!payload || !Array.isArray(state.detailEntries)) {
    return;
  }
  const sitemapUrl =
    payload && typeof payload.sitemapUrl === "string" ? payload.sitemapUrl : state.selected?.url || "";
  const urlResults = Array.isArray(payload.urlResults) ? payload.urlResults : [];
  const headingLinks = Array.isArray(payload.headingLinks) ? payload.headingLinks : [];
  const urlMap = new Map(urlResults.map((item) => [item.url, item]));
  const headingMap = new Map();

  headingLinks.forEach((item) => {
    if (!item || !item.pageUrl) {
      return;
    }
    if (!headingMap.has(item.pageUrl)) {
      headingMap.set(item.pageUrl, []);
    }
    headingMap.get(item.pageUrl).push(item);
  });

  state.detailEntries.forEach((entry) => {
    if (!entry || !entry.href) {
      return;
    }
    const urlInfo = urlMap.get(entry.href);
    if (urlInfo) {
      entry.statusCode = urlInfo.statusCode;
      entry.category = urlInfo.category || null;
      if (urlInfo.title) {
        entry.title = urlInfo.title;
      }
      if (urlInfo.description) {
        entry.description = urlInfo.description;
      }
      entry.responseTimeMs = urlInfo.responseTimeMs;
      if (urlInfo.crawledAt) {
        entry.crawledAt = urlInfo.crawledAt;
      }
    }

    const linkStatuses = headingMap.get(entry.href);
    if (linkStatuses && linkStatuses.length) {
      const normalizedStatuses = linkStatuses.map((item) => ({
        ...item,
        url: item.url || item.linkUrl || "",
      }));
      entry.headingLinkStatuses = normalizedStatuses;
      const latestCheckedAt = normalizedStatuses.reduce((latest, item) => {
        const time = item && item.checkedAt ? Date.parse(item.checkedAt) : NaN;
        if (!Number.isFinite(time)) {
          return latest;
        }
        return time > latest ? time : latest;
      }, 0);
      if (latestCheckedAt) {
        entry.headingLinksCheckedAt = new Date(latestCheckedAt).toISOString();
      }
    }

    if (urlInfo && state.detailMetadata instanceof Map) {
      const existing = state.detailMetadata.get(entry.href);
      state.detailMetadata.set(entry.href, {
        status: "ready",
        title: entry.title || (existing && existing.title) || "",
        description: entry.description || (existing && existing.description) || "",
        paragraphs: (existing && existing.paragraphs) || [],
        schemaTypes: (existing && existing.schemaTypes) || [],
        headings: (existing && existing.headings) || [],
        layout: (existing && existing.layout) || [],
        schema: (existing && existing.schema) || [],
      });
    }
  });

  if (payload.scannedAt) {
    state.detailScan.lastCompletedAt = payload.scannedAt;
  }
  if (sitemapUrl) {
    applyLinkMapStatusesToDetailEntries(sitemapUrl);
  }
  scheduleDetailsRender();
}

function parseSitemapEntries(xmlText, baseUrl) {
  const doc = parseXml(xmlText);
  const type = doc.documentElement.nodeName.toLowerCase();
  const summary = buildSummary(doc, type);
  const entries = extractEntries(doc, type, baseUrl);
  const recentEntries = deriveRecentEntries(entries, 8);
  return { type, entries, summary, recentEntries };
}

function resolveEntryLink(href, baseUrl) {
  if (typeof href !== "string") {
    return "";
  }
  const trimmed = href.trim();
  if (!trimmed) {
    return "";
  }
  try {
    if (baseUrl) {
      return new URL(trimmed, baseUrl).href;
    }
    return new URL(trimmed).href;
  } catch (error) {
    return trimmed;
  }
}

function extractEntries(doc, type, baseUrl) {
  if (type === "urlset") {
    const urls = Array.from(doc.getElementsByTagName("url"));
    return urls.map((node) => {
      const locNode = node.getElementsByTagName("loc")[0];
      const lastNode = node.getElementsByTagName("lastmod")[0];
      const locText = locNode ? locNode.textContent.trim() : "";
      const lastDate = parseDate(lastNode ? lastNode.textContent : null);
      const prefix = deriveDetailPrefixInfo(locText);
      return {
        href: locText,
        label: locText,
        lastMod: lastDate ? formatDateTime(lastDate.toISOString()) : "Belirtilmemis",
        lastModIso: lastDate ? lastDate.toISOString() : null,
        groupKey: prefix.key,
        groupLabel: prefix.label,
      };
    });
  }

  if (type === "sitemapindex") {
    const nodes = Array.from(doc.getElementsByTagName("sitemap"));
    return nodes.map((node) => {
      const locNode = node.getElementsByTagName("loc")[0];
      const lastNode = node.getElementsByTagName("lastmod")[0];
      const locText = locNode ? locNode.textContent.trim() : "";
      const lastDate = parseDate(lastNode ? lastNode.textContent : null);
      const prefix = deriveDetailPrefixInfo(locText);
      return {
        href: locText,
        label: locText,
        lastMod: lastDate ? formatDateTime(lastDate.toISOString()) : "Belirtilmemis",
        lastModIso: lastDate ? lastDate.toISOString() : null,
        groupKey: prefix.key,
        groupLabel: prefix.label,
      };
    });
  }

  if (type === "rss") {
    const channelLinkNode = doc.querySelector && doc.querySelector("channel > link");
    const channelLink =
      (channelLinkNode && channelLinkNode.textContent
        ? channelLinkNode.textContent.trim()
        : "") || baseUrl;
    const items = Array.from(doc.getElementsByTagName("item"));
    return items
      .map((node) => {
        const linkNode = node.getElementsByTagName("link")[0];
        const guidNode = node.getElementsByTagName("guid")[0];
        const rawLink =
          (linkNode && linkNode.textContent ? linkNode.textContent.trim() : "") ||
          (guidNode && guidNode.textContent ? guidNode.textContent.trim() : "");
        const resolvedLink = resolveEntryLink(rawLink, channelLink || baseUrl);
        if (!resolvedLink) {
          return null;
        }
        const titleNode = node.getElementsByTagName("title")[0];
        const dateNode =
          node.getElementsByTagName("pubDate")[0] ||
          node.getElementsByTagName("dc:date")[0];
        const lastDate = parseDate(dateNode ? dateNode.textContent : null);
        const prefix = deriveDetailPrefixInfo(resolvedLink);
        return {
          href: resolvedLink,
          label:
            titleNode && titleNode.textContent.trim()
              ? titleNode.textContent.trim()
              : resolvedLink,
          lastMod: lastDate ? formatDateTime(lastDate.toISOString()) : "Belirtilmemis",
          lastModIso: lastDate ? lastDate.toISOString() : null,
          groupKey: prefix.key,
          groupLabel: prefix.label,
        };
      })
      .filter(Boolean);
  }

  if (type === "feed") {
    const feedLinkNode = doc.getElementsByTagName("link")[0];
    const feedBase =
      (feedLinkNode &&
        ((feedLinkNode.getAttribute && feedLinkNode.getAttribute("href")) ||
          feedLinkNode.textContent) &&
        ((feedLinkNode.getAttribute && feedLinkNode.getAttribute("href")) ||
          feedLinkNode.textContent).trim()) ||
      baseUrl;
    const entries = Array.from(doc.getElementsByTagName("entry"));
    return entries
      .map((node) => {
        const linkNode = node.getElementsByTagName("link")[0];
        let rawLink = "";
        if (linkNode) {
          const hrefAttr =
            typeof linkNode.getAttribute === "function"
              ? linkNode.getAttribute("href")
              : null;
          rawLink = (hrefAttr && hrefAttr.trim()) || linkNode.textContent.trim();
        }
        if (!rawLink) {
          const idNode = node.getElementsByTagName("id")[0];
          rawLink = idNode ? idNode.textContent.trim() : "";
        }
        const resolvedLink = resolveEntryLink(rawLink, feedBase || baseUrl);
        if (!resolvedLink) {
          return null;
        }
        const titleNode = node.getElementsByTagName("title")[0];
        const dateNode =
          node.getElementsByTagName("updated")[0] ||
          node.getElementsByTagName("published")[0];
        const lastDate = parseDate(dateNode ? dateNode.textContent : null);
        const prefix = deriveDetailPrefixInfo(resolvedLink);
        return {
          href: resolvedLink,
          label:
            titleNode && titleNode.textContent.trim()
              ? titleNode.textContent.trim()
              : resolvedLink,
          lastMod: lastDate ? formatDateTime(lastDate.toISOString()) : "Belirtilmemis",
          lastModIso: lastDate ? lastDate.toISOString() : null,
          groupKey: prefix.key,
          groupLabel: prefix.label,
        };
      })
      .filter(Boolean);
  }

  throw new Error(`Beklenmeyen sitemap turu: ${type}`);
}

function deriveRecentEntries(entries, limit = 5) {
  if (!Array.isArray(entries) || !entries.length) {
    return [];
  }

  const normalized = entries
    .map((entry) => ({
      href: typeof entry.href === "string" ? entry.href.trim() : "",
      lastModIso: entry.lastModIso || null,
      lastMod: entry.lastMod || null,
    }))
    .filter((item) => item.href);

  if (!normalized.length) {
    return [];
  }

  const sorted = normalized.sort((a, b) => {
    if (!a.lastModIso && !b.lastModIso) return 0;
    if (!a.lastModIso) return 1;
    if (!b.lastModIso) return -1;
    return new Date(b.lastModIso).getTime() - new Date(a.lastModIso).getTime();
  });

  const unique = [];
  const seen = new Set();

  for (const item of sorted) {
    if (seen.has(item.href)) {
      continue;
    }
    seen.add(item.href);
    unique.push(item);
    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}

function deriveDetailPrefixInfo(href) {
  const fallback = { key: "__other", label: "Diger" };
  if (typeof href !== "string" || !href.trim()) {
    return fallback;
  }

  const normalizeFromPath = (pathname) => {
    if (!pathname || pathname === "/") {
      return { key: "__root", label: "Kok Dizin" };
    }
    const trimmed = pathname.split("?")[0].replace(/^\/+/, "");
    if (!trimmed) {
      return { key: "__root", label: "Kok Dizin" };
    }
    const segments = trimmed.split("/").filter(Boolean);
    if (!segments.length) {
      return { key: "__root", label: "Kok Dizin" };
    }

    // Locale segmentini atla
    let startIndex = 0;
    if (segments.length > 1 && isLocaleSegment(segments[0])) {
      startIndex = 1;
    }

    // AnlamlÃ„Â± ilk segmenti bul
    for (let i = startIndex; i < segments.length; i++) {
      const segment = segments[i];

      // Ãƒâ€¡ok kÃ„Â±sa segmentleri atla (2 karakter altÃ„Â±)
      if (segment.length < 2) {
        continue;
      }

      // Sadece sayÃ„Â± iÃƒÂ§eren segmentleri atla
      if (/^\d+$/.test(segment)) {
        continue;
      }

      // Tarih benzeri segmentleri kontrol et ve kategorize et
      if (isDateLikeSegment(segment)) {
        return { key: "__news_events", label: "Haberler & Etkinlikler" };
      }

      // Dosya uzantÃ„Â±sÃ„Â± olan segmentleri atla
      if (/\.(xml|html|htm|php|asp|aspx|jsp)$/i.test(segment)) {
        continue;
      }

      // Ãƒâ€¡ok uzun ve ÃƒÂ¶zel URL segmentlerini kontrol et (40+ karakter, tire iÃƒÂ§eren)
      if (segment.length > 40 && segment.includes("-")) {
        // Bu tip URL'leri "Blog/Makaleler" olarak grupla
        return { key: "__articles", label: "Blog & Makaleler" };
      }

      // Ã„Â°lk geÃƒÂ§erli segmenti kullan
      const key = segment.toLowerCase();
      const label = formatDetailPrefixLabel(segment);
      return { key, label };
    }

    return { key: "__root", label: "Kok Dizin" };
  };

  try {
    const parsed = new URL(href);
    return normalizeFromPath(parsed.pathname);
  } catch (_error) {
    const withoutHost = href.replace(/^https?:\/\/[^/]+/i, "");
    return normalizeFromPath(withoutHost);
  }
}

function isDateLikeSegment(segment) {
  if (!segment) return false;
  const lower = segment.toLowerCase();

  // Tarih kalÃ„Â±plarÃ„Â±: "14-martta", "2024-03-15", "15-mart-2024" vb.
  if (/^\d{1,2}[-_](ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/i.test(lower)) {
    return true;
  }

  // YÃ„Â±l-ay-gÃƒÂ¼n formatÃ„Â±: "2024-03-15"
  if (/^\d{4}[-_]\d{1,2}[-_]\d{1,2}/.test(segment)) {
    return true;
  }

  // GÃƒÂ¼n-ay-yÃ„Â±l formatÃ„Â±: "15-03-2024"
  if (/^\d{1,2}[-_]\d{1,2}[-_]\d{4}/.test(segment)) {
    return true;
  }

  return false;
}

function formatDetailPrefixLabel(segment) {
  if (!segment) {
    return "Kok Dizin";
  }
  const cleaned = segment.replace(/\.[^/.]+$/, "");
  const withSpaces = cleaned.replace(/[-_]+/g, " ");
  return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
}

function isLocaleSegment(value) {
  if (!value) {
    return false;
  }
  const lower = value.toLowerCase();
  if (DETAIL_LOCALE_SEGMENTS.has(lower)) {
    return true;
  }
  return /^[a-z]{2}(?:-[a-z]{2})?$/.test(lower);
}

function ensureDetailEntryGroup(entry) {
  if (!entry) {
    return;
  }
  if (!entry.groupKey || !entry.groupLabel) {
    const prefix = deriveDetailPrefixInfo(entry.href);
    entry.groupKey = prefix.key;
    entry.groupLabel = prefix.label;
  }
}

function buildDetailPrefixSummary(entries) {
  const groups = new Map();
  for (const entry of entries) {
    ensureDetailEntryGroup(entry);
    const key = entry.groupKey || "__other";
    const label = entry.groupLabel || "Diger";
    if (!groups.has(key)) {
      groups.set(key, { key, label, count: 0 });
    }
    groups.get(key).count += 1;
  }

  // Sadece 2 veya daha fazla URL iÃƒÂ§eren gruplarÃ„Â± gÃƒÂ¶ster
  const MIN_GROUP_SIZE = 2;
  const filteredGroups = Array.from(groups.values()).filter(group => group.count >= MIN_GROUP_SIZE);

  return filteredGroups.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.label.localeCompare(b.label, "tr", { sensitivity: "base" });
  });
}

function updateDetailPrefixSummary(entries) {
  state.detailPrefixTotal = entries.length;
  state.detailPrefixSummary = [];
  state.detailHasMoreGroups = false;

  if (!entries.length) {
    renderDetailPrefixMenu();
    return;
  }

  const summary = buildDetailPrefixSummary(entries);
  state.detailPrefixSummary = summary;
  state.detailHasMoreGroups = summary.length > DETAIL_MAX_INLINE_GROUPS;

  const isFilterValid = summary.some((item) => item.key === state.detailPrefixFilter);
  if (!isFilterValid) {
    state.detailPrefixFilter = null;
  }
  renderDetailPrefixMenu();
}

function filterEntriesByPrefix(entries, prefixKey) {
  if (!prefixKey) {
    return entries;
  }
  return entries.filter((entry) => {
    ensureDetailEntryGroup(entry);
    return entry.groupKey === prefixKey;
  });
}

function getHeadingStatusCounts(entry) {
  const statuses = Array.isArray(entry && entry.headingLinkStatuses)
    ? entry.headingLinkStatuses
    : [];
  const counts = {
    count200: 0,
    count301: 0,
    count404: 0,
    count4xx: 0,
    count500: 0,
    countOther: 0,
  };
  const applyStatus = (status, weight = 1) => {
    const safeWeight = Number.isFinite(Number(weight))
      ? Math.max(1, Math.floor(Number(weight)))
      : 1;
    if (status === 200) {
      counts.count200 += safeWeight;
    } else if (status === 301) {
      counts.count301 += safeWeight;
    } else if (status === 404) {
      counts.count404 += safeWeight;
    } else if (status === 500) {
      counts.count500 += safeWeight;
    } else if (status >= 400 && status < 500) {
      counts.count4xx += safeWeight;
    } else if (status != null) {
      counts.countOther += safeWeight;
    } else {
      counts.countOther += safeWeight;
    }
  };

  if (statuses.length) {
    statuses.forEach((result) => {
      const rawStatus = result && (result.status ?? result.statusCode);
      const status = Number.isFinite(Number(rawStatus)) ? Number(rawStatus) : null;
      const weight =
        result && Number.isFinite(Number(result.count))
          ? Number(result.count)
          : 1;
      applyStatus(status, weight);
    });
  } else {
    const fallbackStatus =
      Number.isFinite(Number(entry && entry.statusCode)) ? Number(entry.statusCode) : null;
    if (fallbackStatus != null) {
      applyStatus(fallbackStatus);
    }
  }

  const total =
    counts.count200 +
    counts.count301 +
    counts.count404 +
    counts.count4xx +
    counts.count500 +
    counts.countOther;
  const score = total ? Math.round((counts.count200 / total) * 100) : null;
  return { ...counts, total, score };
}

function getIssueStatsForEntry(entry) {
  const statuses = Array.isArray(entry && entry.headingLinkStatuses)
    ? entry.headingLinkStatuses
    : [];
  const stats = {
    count2xx: 0,
    count3xx: 0,
    count404: 0,
    count4xx: 0,
    count5xx: 0,
    countOther: 0,
  };
  const applyStatus = (status, weight = 1) => {
    const safeWeight = Number.isFinite(Number(weight))
      ? Math.max(1, Math.floor(Number(weight)))
      : 1;
    if (status >= 200 && status < 300) {
      stats.count2xx += safeWeight;
    } else if (status >= 300 && status < 400) {
      stats.count3xx += safeWeight;
    } else if (status === 404) {
      stats.count404 += safeWeight;
    } else if (status >= 400 && status < 500) {
      stats.count4xx += safeWeight;
    } else if (status >= 500 && status < 600) {
      stats.count5xx += safeWeight;
    } else if (status != null) {
      stats.countOther += safeWeight;
    } else {
      stats.countOther += safeWeight;
    }
  };

  if (statuses.length) {
    statuses.forEach((result) => {
      const rawStatus = result && (result.status ?? result.statusCode);
      const status = Number.isFinite(Number(rawStatus)) ? Number(rawStatus) : null;
      const weight =
        result && Number.isFinite(Number(result.count))
          ? Number(result.count)
          : 1;
      applyStatus(status, weight);
    });
  } else {
    const fallbackStatus =
      Number.isFinite(Number(entry && entry.statusCode)) ? Number(entry.statusCode) : null;
    if (fallbackStatus != null) {
      applyStatus(fallbackStatus);
    }
  }

  const total =
    stats.count2xx +
    stats.count3xx +
    stats.count404 +
    stats.count4xx +
    stats.count5xx +
    stats.countOther;
  const hasIssues =
    stats.count3xx + stats.count404 + stats.count4xx + stats.count5xx + stats.countOther > 0;
  return { ...stats, total, hasIssues };
}

function buildDetailIssueSummary(entries) {
  const summary = [
    {
      key: "issues",
      label: t("details.issues.any"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).hasIssues).length,
    },
    {
      key: "2xx",
      label: t("details.issues.2xx"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).count2xx > 0).length,
    },
    {
      key: "3xx",
      label: t("details.issues.3xx"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).count3xx > 0).length,
    },
    {
      key: "404",
      label: t("details.issues.404"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).count404 > 0).length,
    },
    {
      key: "4xx",
      label: t("details.issues.4xx"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).count4xx > 0).length,
    },
    {
      key: "5xx",
      label: t("details.issues.5xx"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).count5xx > 0).length,
    },
    {
      key: "other",
      label: t("details.issues.other"),
      count: entries.filter((entry) => getIssueStatsForEntry(entry).countOther > 0).length,
    },
  ];
  return summary.filter((item) => item.count > 0);
}

function updateDetailIssueSummary(entries) {
  state.detailIssueTotal = entries.length;
  state.detailIssueSummary = buildDetailIssueSummary(entries);
  const validKeys = state.detailIssueSummary.map((item) => item.key);
  if (state.detailIssueFilter && !validKeys.includes(state.detailIssueFilter)) {
    state.detailIssueFilter = null;
  }
  renderDetailIssueMenu();
}

function filterEntriesByIssue(entries, issueKey) {
  if (!issueKey) {
    return entries;
  }
  return entries.filter((entry) => {
    const stats = getIssueStatsForEntry(entry);
    if (issueKey === "issues") {
      return stats.hasIssues;
    }
    if (issueKey === "2xx") {
      return stats.count2xx > 0;
    }
    if (issueKey === "3xx") {
      return stats.count3xx > 0;
    }
    if (issueKey === "404") {
      return stats.count404 > 0;
    }
    if (issueKey === "4xx") {
      return stats.count4xx > 0;
    }
    if (issueKey === "5xx") {
      return stats.count5xx > 0;
    }
    if (issueKey === "other") {
      return stats.countOther > 0;
    }
    return true;
  });
}

function renderDetailIssueMenu() {
  if (!detailsIssueFilter) {
    return;
  }
  detailsIssueFilter.innerHTML = "";

  if (!state.detailIssueTotal || !state.detailIssueSummary.length) {
    const empty = document.createElement("span");
    empty.classList.add("details-groups__empty");
    empty.textContent = t("details.issues.empty");
    detailsIssueFilter.appendChild(empty);
    return;
  }

  detailsIssueFilter.appendChild(
    createDetailIssueButton(t("filters.all"), null, state.detailIssueTotal)
  );

  for (const group of state.detailIssueSummary) {
    detailsIssueFilter.appendChild(createDetailIssueButton(group.label, group.key, group.count));
  }
}

function createDetailIssueButton(label, key, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("details-groups__button");

  const isActive =
    (key === null && state.detailIssueFilter === null) ||
    (key !== null && state.detailIssueFilter === key);

  if (isActive) {
    button.classList.add("details-groups__button--active");
  }

  const text = document.createElement("span");
  text.textContent = label;

  const counter = document.createElement("span");
  counter.classList.add("details-groups__count");
  counter.textContent = count.toLocaleString("tr-TR");

  button.append(text, counter);
  button.addEventListener("click", () => {
    handleDetailIssueSelection(key);
  });
  return button;
}

function handleDetailIssueSelection(key) {
  const nextSelection = key !== null && state.detailIssueFilter === key ? null : key;
  state.detailIssueFilter = nextSelection;
  state.detailPage = 1;
  renderDetails();
}

function resetDetailIssueState() {
  state.detailIssueSummary = [];
  state.detailIssueFilter = null;
  state.detailIssueTotal = 0;
  renderDetailIssueMenu();
}

function getScoreTone(score) {
  if (score == null) {
    return "muted";
  }
  if (score >= 90) {
    return "ok";
  }
  if (score >= 70) {
    return "warn";
  }
  return "error";
}

function createDetailsMetricCell(value, tone, { isLoading = false, isScore = false } = {}) {
  const cell = document.createElement("td");
  cell.classList.add("details-row__cell", "details-row__cell--metric");
  const badge = document.createElement("span");
  badge.classList.add("details-count");
  if (isScore) {
    badge.classList.add("details-score");
  }
  if (isLoading) {
    badge.classList.add("details-count--loading");
    badge.textContent = "...";
  } else {
    const normalized = value == null ? "-" : value;
    if (isScore) {
      const scoreTone = getScoreTone(typeof normalized === "number" ? normalized : null);
      if (scoreTone !== "muted") {
        badge.classList.add(`details-score--${scoreTone}`);
      } else {
        badge.classList.add("details-count--muted");
      }
    } else if (tone) {
      badge.classList.add(`details-count--${tone}`);
    }
    badge.textContent = String(normalized);
  }
  cell.appendChild(badge);
  return cell;
}
function renderDetailPrefixMenu() {
  if (!detailsPrefixFilter) {
    return;
  }

  detailsPrefixFilter.innerHTML = "";
  toggleDetailPrefixPopover(false, { force: true });

  const summary = state.detailPrefixSummary;
  const total = state.detailPrefixTotal;

  const hasGroups = Array.isArray(summary) && summary.length > 0;

  if (!total || !hasGroups) {
    const empty = document.createElement("span");
    empty.classList.add("details-groups__empty");
    empty.textContent = t("details.groups.empty");
    detailsPrefixFilter.appendChild(empty);
    state.detailHasMoreGroups = false;
    updateDetailPrefixMoreVisibility(false);
    return;
  }

  detailsPrefixFilter.appendChild(createDetailPrefixButton(t("filters.all"), null, total));

  const inlineGroups = summary.slice(0, DETAIL_MAX_INLINE_GROUPS);
  const extraGroups = summary.slice(DETAIL_MAX_INLINE_GROUPS);

  for (const group of inlineGroups) {
    detailsPrefixFilter.appendChild(createDetailPrefixButton(group.label, group.key, group.count));
  }

  const hasMore = extraGroups.length > 0;
  state.detailHasMoreGroups = hasMore;
  updateDetailPrefixMoreVisibility(hasMore, extraGroups);
}

function createDetailPrefixButton(label, key, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("details-groups__button");

  const isActive =
    (key === null && state.detailPrefixFilter === null) ||
    (key !== null && state.detailPrefixFilter === key);

  if (isActive) {
    button.classList.add("details-groups__button--active");
  }

  const text = document.createElement("span");
  text.textContent = label;

  const counter = document.createElement("span");
  counter.classList.add("details-groups__count");
  counter.textContent = count.toLocaleString("tr-TR");

  button.append(text, counter);

  button.addEventListener("click", () => {
    handleDetailPrefixSelection(key);
  });

  return button;
}

function createDetailPrefixPopoverButton(label, key, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("details-groups__button");
  button.setAttribute("role", "menuitem");

  const isActive = state.detailPrefixFilter === key;

  if (isActive) {
    button.classList.add("details-groups__button--active");
  }

  const text = document.createElement("span");
  text.textContent = label;

  const counter = document.createElement("span");
  counter.classList.add("details-groups__count");
  counter.textContent = count.toLocaleString("tr-TR");

  button.append(text, counter);

  button.addEventListener("click", () => {
    handleDetailPrefixSelection(key);
    toggleDetailPrefixPopover(false, { force: true });
  });

  return button;
}

function handleDetailPrefixSelection(key) {
  let nextSelection = key;
  if (key !== null && state.detailPrefixFilter === key) {
    nextSelection = null;
  }
  state.detailPrefixFilter = nextSelection;
  state.detailPage = 1;
  renderDetails();
  toggleDetailPrefixPopover(false, { force: true });
}

function toggleDetailPrefixPopover(forceState, { force = false } = {}) {
  if (!detailsPrefixMore || !detailsPrefixPopover) {
    return;
  }
  if (!state.detailHasMoreGroups && !force) {
    return;
  }

  const currentState = detailsPrefixMore.getAttribute("aria-expanded") === "true";
  const nextState = typeof forceState === "boolean" ? forceState : !currentState;

  if (!force && nextState === currentState) {
    return;
  }

  detailsPrefixMore.setAttribute("aria-expanded", String(nextState));
  detailsPrefixPopover.setAttribute("aria-hidden", String(!nextState));
}

let detailPrefixMenuInitialized = false;

function initializeDetailPrefixMenu() {
  if (detailPrefixMenuInitialized) {
    return;
  }
  detailPrefixMenuInitialized = true;

  if (!detailsPrefixMore || !detailsPrefixPopover) {
    return;
  }

  detailsPrefixMore.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!state.detailHasMoreGroups) {
      return;
    }
    toggleDetailPrefixPopover();
  });

  document.addEventListener("click", (event) => {
    if (!state.detailHasMoreGroups) {
      return;
    }
    const isOpen = detailsPrefixMore.getAttribute("aria-expanded") === "true";
    if (!isOpen) {
      return;
    }
    if (
      event.target instanceof Node &&
      (detailsPrefixPopover.contains(event.target) || detailsPrefixMore.contains(event.target))
    ) {
      return;
    }
    toggleDetailPrefixPopover(false, { force: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleDetailPrefixPopover(false, { force: true });
    }
  });
}

function updateDetailPrefixMoreVisibility(visible, extraGroups = []) {
  if (!detailsPrefixMore || !detailsPrefixPopover || !detailsPrefixMoreContainer) {
    return;
  }

  if (!visible) {
    detailsPrefixMoreContainer.classList.remove("details-groups__more--visible");
    detailsPrefixMore.classList.remove("details-groups__more-trigger--selected");
    detailsPrefixMore.setAttribute("aria-expanded", "false");
    detailsPrefixPopover.setAttribute("aria-hidden", "true");
    detailsPrefixPopover.innerHTML = "";
    return;
  }

  detailsPrefixMoreContainer.classList.add("details-groups__more--visible");
  detailsPrefixPopover.innerHTML = "";

  if (!extraGroups.length) {
    const empty = document.createElement("span");
    empty.classList.add("details-groups__more-empty");
    empty.textContent = t("details.more.empty");
    detailsPrefixPopover.appendChild(empty);
  } else {
    for (const group of extraGroups) {
      detailsPrefixPopover.appendChild(
        createDetailPrefixPopoverButton(group.label, group.key, group.count)
      );
    }
  }

  const selectedIsExtra = extraGroups.some((group) => group.key === state.detailPrefixFilter);
  detailsPrefixMore.classList.toggle("details-groups__more-trigger--selected", selectedIsExtra);
  detailsPrefixMore.setAttribute("aria-expanded", "false");
  detailsPrefixPopover.setAttribute("aria-hidden", "true");
}

function renderDetails() {
  setDetailsExportEnabled(false);
  updateDetailsScanControls();
  renderComparePanel();

  if (!state.selected) {
    state.detailPrefixSummary = [];
    state.detailPrefixTotal = 0;
    state.detailHasMoreGroups = false;
    updateDetailPrefixMoreVisibility(false);
    renderDetailPrefixMenu();
    resetDetailIssueState();
    detailsTitle.textContent = t("details.title");
    detailsLinkHeader.textContent = t("details.table.link");
    detailsDateHeader.textContent = t("details.table.lastUpdated");
    detailsTableBody.innerHTML = "";
    detailsTableBody.appendChild(createDetailsEmptyRow(t("details.empty.noSelection")));
    setDetailStatus(t("details.status.idle"));
    return;
  }

  detailsTitle.textContent = state.selected.title;
  detailsLinkHeader.textContent =
    state.detailType === "sitemapindex" ? t("details.table.child") : t("details.table.link");
  detailsDateHeader.textContent = t("details.table.lastUpdated");

  if (state.selected.error) {
    state.detailPrefixSummary = [];
    state.detailPrefixTotal = 0;
    state.detailHasMoreGroups = false;
    updateDetailPrefixMoreVisibility(false);
    renderDetailPrefixMenu();
    resetDetailIssueState();
    detailsTableBody.innerHTML = "";
    detailsTableBody.appendChild(createDetailsEmptyRow(t("details.error.load")));
    setDetailStatus(t("details.status.loadError", { error: state.selected.error }));
    return;
  }

  if (state.isLoadingDetails) {
    state.detailPrefixSummary = [];
    state.detailPrefixTotal = 0;
    state.detailHasMoreGroups = false;
    updateDetailPrefixMoreVisibility(false);
    renderDetailPrefixMenu();
    resetDetailIssueState();
    showDetailSkeletonLoader(8);
    return;
  }

  if (!state.detailEntries.length) {
    state.detailPrefixSummary = [];
    state.detailPrefixTotal = 0;
    state.detailHasMoreGroups = false;
    updateDetailPrefixMoreVisibility(false);
    renderDetailPrefixMenu();
    resetDetailIssueState();
    detailsTableBody.innerHTML = "";
    detailsTableBody.appendChild(createDetailsEmptyRow(t("details.empty.noData")));
    setDetailStatus(t("details.status.noData"));
    return;
  }

  const filteredByDate = applyDetailFilters(state.detailEntries, state.detailFilters);
  const filteredBySearch = applyDetailSearch(filteredByDate, state.detailSearchQuery);

  updateDetailPrefixSummary(filteredBySearch);
  const filteredByPrefix = filterEntriesByPrefix(filteredBySearch, state.detailPrefixFilter);
  updateDetailIssueSummary(filteredByPrefix);
  const filteredEntries = filterEntriesByIssue(filteredByPrefix, state.detailIssueFilter);

  filteredEntries.sort(compareDetailEntriesByDateDesc);
  renderDetailsChart(filteredEntries);

  if (!filteredEntries.length) {
    detailsTableBody.innerHTML = "";
    detailsTableBody.appendChild(createDetailsEmptyRow(t("details.empty.filtered")));
    setDetailStatus(t("details.status.filteredEmpty"));
    updatePaginationControls(1, 0, state.detailPerPage);
    return;
  }

  setDetailsExportEnabled(true);

  const totalFilteredCount = filteredEntries.length;
  const totalPages = Math.ceil(totalFilteredCount / state.detailPerPage);
  if (state.detailPage > totalPages) {
    state.detailPage = totalPages;
  }
  if (state.detailPage < 1) {
    state.detailPage = 1;
  }

  const paginatedEntries = paginateEntries(filteredEntries, state.detailPage, state.detailPerPage);

  detailsTableBody.innerHTML = "";
  detailRowIdCounter = 0;

  for (const entry of paginatedEntries) {
    const tr = document.createElement("tr");
    tr.classList.add("details-row");
    const detailRowId = `detail-meta-${detailRowIdCounter++}`;

    const linkCell = document.createElement("td");
    linkCell.classList.add("details-row__cell");
    const isExpanded = entry.href && state.detailExpandedUrl === entry.href;
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.classList.add("details-row__toggle");
    toggleButton.setAttribute("aria-expanded", String(Boolean(isExpanded)));
    toggleButton.setAttribute("aria-controls", detailRowId);
    toggleButton.setAttribute("aria-label", t("details.metadata.toggle"));
    toggleButton.dataset.href = entry.href || "";
    const toggleIcon = createIcon("solar:alt-arrow-down-line-duotone", 18);
    toggleButton.appendChild(toggleIcon);
    const toggleLabel = document.createElement("span");
    toggleLabel.classList.add("visually-hidden");
    toggleLabel.textContent = t("details.metadata.toggle");
    toggleButton.appendChild(toggleLabel);
    linkCell.appendChild(toggleButton);

    const actions = document.createElement("div");
    actions.classList.add("details-row__actions");
    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.classList.add("details-row__action");
    openButton.dataset.action = "open-url";
    openButton.dataset.href = entry.href || "";
    openButton.setAttribute("aria-label", t("details.actions.openUrl"));
    openButton.appendChild(createIcon("mdi:open-in-new", 16));
    actions.appendChild(openButton);
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.classList.add("details-row__action");
    copyButton.dataset.action = "copy-url";
    copyButton.dataset.href = entry.href || "";
    copyButton.setAttribute("aria-label", t("details.actions.copyUrl"));
    copyButton.appendChild(createIcon("mdi:content-copy", 16));
    actions.appendChild(copyButton);
    const isCompared =
      entry.href && Array.isArray(state.detailCompare)
        ? state.detailCompare.some((item) => item && item.url === entry.href)
        : false;
    const compareButton = document.createElement("button");
    compareButton.type = "button";
    compareButton.classList.add("details-row__action");
    compareButton.classList.add("details-row__action--compare");
    if (isCompared) {
      compareButton.classList.add("details-row__action--active");
    }
    compareButton.dataset.action = "compare-add";
    compareButton.dataset.href = entry.href || "";
    compareButton.setAttribute("aria-label", t("details.actions.compareAdd"));
    compareButton.textContent = isCompared ? "âœ“" : "+";
    actions.appendChild(compareButton);
    const singleButton = document.createElement("button");
    singleButton.type = "button";
    singleButton.classList.add("details-row__action");
    singleButton.dataset.action = "single-crawl";
    singleButton.dataset.href = entry.href || "";
    singleButton.setAttribute("aria-label", t("details.actions.scanSingle"));
    singleButton.appendChild(createIcon("mdi:flash-outline", 16));
    actions.appendChild(singleButton);
    linkCell.appendChild(actions);

    const link = document.createElement("a");
    link.href = entry.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = entry.label || entry.href || t("details.table.link");
    link.classList.add("table__link");
    linkCell.appendChild(link);

    const meta = document.createElement("div");
    meta.classList.add("details-row__meta");
    if (entry.title) {
      const metaTitle = document.createElement("div");
      metaTitle.classList.add("details-row__meta-title");
      metaTitle.textContent = entry.title;
      meta.appendChild(metaTitle);
    }
    if (entry.description) {
      const metaDesc = document.createElement("div");
      metaDesc.classList.add("details-row__meta-description");
      metaDesc.textContent = entry.description;
      meta.appendChild(metaDesc);
    }
    if (meta.childElementCount) {
      linkCell.appendChild(meta);
    }

    tr.appendChild(linkCell);

    const headingStats = getHeadingStatusCounts(entry);
    const isHeadingLoading =
      state.detailScan && state.detailScan.status === "running" && !entry.headingLinksCheckedAt;
    const hasHeadingData = headingStats.total > 0;
    const hasHeadingCheck = Boolean(entry.headingLinksCheckedAt || entry.crawledAt);
    const showCounts = hasHeadingData || hasHeadingCheck;
    const showLoading = !showCounts && isHeadingLoading;

    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.count200 : null, "ok", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.count301 : null, "warn", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.count404 : null, "error", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.count4xx : null, "error", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.count500 : null, "error", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.countOther : null, "muted", {
        isLoading: showLoading,
      })
    );
    tr.appendChild(
      createDetailsMetricCell(showCounts ? headingStats.score : null, "muted", {
        isLoading: showLoading,
        isScore: true,
      })
    );

    const lastCrawlCell = document.createElement("td");
    lastCrawlCell.classList.add("table__date");
    lastCrawlCell.textContent = entry.crawledAt
      ? formatDateTime(entry.crawledAt)
      : t("datetime.unknown");
    tr.appendChild(lastCrawlCell);

    const dateCell = document.createElement("td");
    dateCell.classList.add("table__date");
    dateCell.textContent = entry.lastMod || t("datetime.unknown");
    tr.appendChild(dateCell);

    detailsTableBody.appendChild(tr);

    const accordionRow = document.createElement("tr");
    accordionRow.classList.add("details-row__detail");
    accordionRow.id = detailRowId;
    accordionRow.hidden = !isExpanded;
    accordionRow.classList.toggle("details-row__detail--visible", Boolean(isExpanded));

    const accordionCell = document.createElement("td");
    accordionCell.colSpan = 10;
    accordionCell.classList.add("details-row__detail-cell");

    const metadataContainer = document.createElement("div");
    metadataContainer.classList.add("details-metadata");
    const metadataEntry =
      state.detailMetadata instanceof Map ? state.detailMetadata.get(entry.href) : null;
    const headingStatusMap = new Map();
    if (Array.isArray(entry.headingLinkStatuses)) {
      entry.headingLinkStatuses.forEach((item) => {
        if (item && item.url) {
          headingStatusMap.set(item.url, item);
        }
      });
    }

    const addMetadataGroup = (container, labelText, valueNodeOrText) => {
      const group = document.createElement("div");
      group.classList.add("details-metadata__group");
      const label = document.createElement("p");
      label.classList.add("details-metadata__label");
      label.textContent = labelText;
      group.appendChild(label);

      if (valueNodeOrText instanceof Node) {
        group.appendChild(valueNodeOrText);
      } else {
        const value = document.createElement("p");
        value.classList.add("details-metadata__value");
        value.textContent = valueNodeOrText || "-";
        group.appendChild(value);
      }

      container.appendChild(group);
    };

    const normalizeHeadingLevel = (rawLevel) => {
      if (typeof rawLevel === "number" && Number.isFinite(rawLevel)) {
        return `H${rawLevel}`;
      }
      if (typeof rawLevel === "string" && rawLevel.trim()) {
        const cleaned = rawLevel.trim().toUpperCase();
        return cleaned.startsWith("H") ? cleaned : `H${cleaned}`;
      }
      return "H";
    };

    const headings = Array.isArray(metadataEntry && metadataEntry.headings)
      ? metadataEntry.headings
      : [];
    const layout = Array.isArray(metadataEntry && metadataEntry.layout)
      ? metadataEntry.layout
      : [];
    const schemaBlocks = Array.isArray(metadataEntry && metadataEntry.schema)
      ? metadataEntry.schema
      : [];
    const activeTab =
      (entry.href && state.detailAccordionTabs.get(entry.href)) || "content";

    const tabs = document.createElement("div");
    tabs.classList.add("details-metadata__tabs");

    const tabList = document.createElement("div");
    tabList.classList.add("details-metadata__tablist");
    tabList.setAttribute("role", "tablist");

    const createTabButton = (key, label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("details-metadata__tab");
      button.dataset.tab = key;
      button.dataset.href = entry.href || "";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(activeTab === key));
      button.classList.toggle("details-metadata__tab--active", activeTab === key);
      button.textContent = label;
      return button;
    };

    tabList.appendChild(createTabButton("content", t("details.metadata.tab.content")));
    tabList.appendChild(createTabButton("layout", t("details.metadata.tab.layout")));
    tabList.appendChild(createTabButton("schema", t("details.metadata.tab.schema")));
    tabs.appendChild(tabList);

    const contentPanel = document.createElement("div");
    contentPanel.classList.add("details-metadata__panel");
    contentPanel.hidden = activeTab !== "content";

    if (metadataEntry && metadataEntry.status === "loading") {
      const loading = document.createElement("p");
      loading.classList.add("details-metadata__loading");
      loading.textContent = t("details.metadata.loading");
      contentPanel.appendChild(loading);
    } else if (metadataEntry && metadataEntry.status === "error") {
      const error = document.createElement("p");
      error.classList.add("details-metadata__empty");
      error.textContent = t("details.metadata.error", {
        error: metadataEntry.error || "Unknown error",
      });
      contentPanel.appendChild(error);
    } else if (!entry.title && !entry.description && !headings.length) {
      const empty = document.createElement("p");
      empty.classList.add("details-metadata__empty");
      empty.textContent = t("details.metadata.empty");
      contentPanel.appendChild(empty);
    } else {
      if (entry.title) {
        addMetadataGroup(contentPanel, t("details.metadata.titleLabel"), entry.title);
      }
      if (entry.description) {
        addMetadataGroup(contentPanel, t("details.metadata.descriptionLabel"), entry.description);
      }

      if (headings.length) {
        const headingsGroup = document.createElement("div");
        headingsGroup.classList.add("details-metadata__group");
        const headingsLabel = document.createElement("p");
        headingsLabel.classList.add("details-metadata__label");
        headingsLabel.textContent = t("details.metadata.headingsLabel");
        headingsGroup.appendChild(headingsLabel);

        const headingsList = document.createElement("ul");
        headingsList.classList.add("details-metadata__headings");

        headings.forEach((heading) => {
          if (!heading) {
            return;
          }
          const headingItem = document.createElement("li");
          headingItem.classList.add("details-metadata__heading-item");

          const headingHeader = document.createElement("div");
          headingHeader.classList.add("details-metadata__heading-header");

          const headingBadge = document.createElement("span");
          headingBadge.classList.add("details-metadata__heading-badge");
          headingBadge.textContent = normalizeHeadingLevel(
            heading.level ?? heading.tag ?? heading.rank
          );
          headingHeader.appendChild(headingBadge);

          const headingText = document.createElement("span");
          headingText.classList.add("details-metadata__heading-text");
          headingText.textContent =
            heading.text || heading.title || heading.heading || "-";
          headingHeader.appendChild(headingText);

          headingItem.appendChild(headingHeader);

          const links = Array.isArray(heading.links) ? heading.links : [];
          if (links.length) {
            const linksLabel = document.createElement("p");
            linksLabel.classList.add("details-metadata__heading-links-label");
            linksLabel.textContent = t("details.metadata.headingLinksLabel");
            headingItem.appendChild(linksLabel);

            const linksList = document.createElement("ul");
            linksList.classList.add("details-metadata__heading-links");

            links.forEach((link) => {
              if (!link || !link.href) {
                return;
              }
              const linkItem = document.createElement("li");
              linkItem.classList.add("details-metadata__heading-link-item");

              const linkAnchor = document.createElement("a");
              linkAnchor.classList.add("details-metadata__heading-link");
              linkAnchor.href = link.href;
              linkAnchor.target = "_blank";
              linkAnchor.rel = "noopener noreferrer";
              linkAnchor.textContent = link.text || link.href;
              linkItem.appendChild(linkAnchor);

              const statusMatch = headingStatusMap.get(link.href);
              const rawStatus = statusMatch && (statusMatch.status ?? statusMatch.statusCode);
              const statusCode = Number.isFinite(Number(rawStatus)) ? Number(rawStatus) : null;
              if (statusCode) {
                const statusBadge = document.createElement("span");
                statusBadge.classList.add("details-metadata__heading-link-status");
                if (statusCode >= 400) {
                  statusBadge.classList.add("details-metadata__heading-link-status--error");
                } else if (statusCode >= 300) {
                  statusBadge.classList.add("details-metadata__heading-link-status--warn");
                }
                statusBadge.textContent = String(statusCode);
                linkItem.appendChild(statusBadge);
              }

              linksList.appendChild(linkItem);
            });

            headingItem.appendChild(linksList);
          }

          headingsList.appendChild(headingItem);
        });

        headingsGroup.appendChild(headingsList);
        contentPanel.appendChild(headingsGroup);
      }
    }

    const layoutPanel = document.createElement("div");
    layoutPanel.classList.add("details-metadata__panel");
    layoutPanel.hidden = activeTab !== "layout";
    if (!layout.length) {
      const empty = document.createElement("p");
      empty.classList.add("details-metadata__empty");
      empty.textContent = t("details.metadata.layout.empty");
      layoutPanel.appendChild(empty);
    } else {
      const list = buildLayoutList(layout);
      layoutPanel.appendChild(list);
    }

    const schemaPanel = document.createElement("div");
    schemaPanel.classList.add("details-metadata__panel");
    schemaPanel.hidden = activeTab !== "schema";
    if (!schemaBlocks.length) {
      const empty = document.createElement("p");
      empty.classList.add("details-metadata__empty");
      empty.textContent = t("details.metadata.schema.empty");
      schemaPanel.appendChild(empty);
    } else {
      schemaBlocks.forEach((block, index) => {
        const group = document.createElement("div");
        group.classList.add("details-metadata__group");
        const label = document.createElement("p");
        label.classList.add("details-metadata__label");
        label.textContent = t("details.metadata.schema.blockLabel", {
          index: index + 1,
        });
        group.appendChild(label);
        const pre = document.createElement("pre");
        pre.classList.add("details-metadata__schema");
        if (block && block.data) {
          pre.textContent = JSON.stringify(block.data, null, 2);
        } else {
          pre.textContent = block && block.raw ? block.raw : "-";
        }
        group.appendChild(pre);
        schemaPanel.appendChild(group);
      });
    }

    metadataContainer.appendChild(tabs);
    metadataContainer.appendChild(contentPanel);
    metadataContainer.appendChild(layoutPanel);
    metadataContainer.appendChild(schemaPanel);

    if (isExpanded && entry.href) {
      loadDetailMetadataForUrl(entry.href);
    }

    accordionCell.appendChild(metadataContainer);
    accordionRow.appendChild(accordionCell);
    detailsTableBody.appendChild(accordionRow);
  }

  updatePaginationControls(state.detailPage, totalFilteredCount, state.detailPerPage);

  const activeFilters = [];
  if (state.detailSearchQuery) {
    activeFilters.push(t("details.status.filter.search"));
  }
  if (state.detailPrefixFilter) {
    const activeGroup = state.detailPrefixSummary.find(
      (group) => group.key === state.detailPrefixFilter
    );
    activeFilters.push(
      t("details.status.filter.group", {
        label: activeGroup ? activeGroup.label : state.detailPrefixFilter,
      })
    );
  }
  if (state.detailFilters.from || state.detailFilters.to) {
    activeFilters.push(t("details.status.filter.date"));
  }

  if (activeFilters.length) {
    setDetailStatus(
      t("details.status.summaryFiltered", {
        count: numberFormatter.format(totalFilteredCount),
        filters: activeFilters.join(", "),
        pageCount: numberFormatter.format(paginatedEntries.length),
      })
    );
  } else {
    setDetailStatus(
      t("details.status.summary", {
        count: numberFormatter.format(totalFilteredCount),
      })
    );
  }
}

function renderDomainSitemapList(domain) {
  state.detailPrefixSummary = [];
  state.detailPrefixTotal = 0;
  state.detailHasMoreGroups = false;
  updateDetailPrefixMoreVisibility(false);
  renderDetailPrefixMenu();
  resetDetailIssueState();

  detailsTitle.textContent = t("details.domain.title", { domain });
  detailsLinkHeader.textContent = t("details.domain.sitemapList");
  detailsDateHeader.textContent = t("details.table.lastUpdated");
  detailsTableBody.innerHTML = "";

  const items = state.sitemaps.filter((item) => item.domain === domain);
  if (!items.length) {
    detailsTableBody.appendChild(createDetailsEmptyRow(t("details.domain.empty")));
    setDetailStatus(t("details.domain.emptyStatus", { domain }));
    return;
  }

  const sorted = items
    .map((item) => ({
      ...item,
      title: item.title || item.url,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  for (const item of sorted) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 10;
    td.classList.add("details-domain__cell");

    const wrapper = document.createElement("div");
    wrapper.classList.add("details-domain__item");

    const title = document.createElement("div");
    title.classList.add("details-domain__title");
    title.textContent = item.title || item.url;

    const link = document.createElement("a");
    link.classList.add("details-domain__link");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.url;

    const actions = document.createElement("div");
    actions.classList.add("details-domain__actions");
    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.classList.add("details-domain__button");
    viewButton.textContent = t("details.domain.open");
    viewButton.addEventListener("click", () => {
      const row = state.rows.find((r) => r.url === item.url) || item;
      showDetails(row);
    });
    actions.appendChild(viewButton);

    wrapper.append(title, link, actions);
    td.appendChild(wrapper);
    tr.appendChild(td);
    detailsTableBody.appendChild(tr);
  }

  setDetailStatus(
    t("details.domain.summary", { count: numberFormatter.format(sorted.length), domain })
  );
  updatePaginationControls(1, sorted.length, sorted.length);
}

function applyDetailFilters(entries, filters) {
  const fromDate = parseFilterDate(filters.from);
  const toDate = parseFilterDate(filters.to);
  const fromBoundary = fromDate ? startOfDay(fromDate) : null;
  const toBoundary = toDate ? endOfDay(toDate) : null;

  return entries.filter((entry) => {
    if (!entry.lastModIso) {
      return true;
    }

    const entryDate = new Date(entry.lastModIso);
    if (fromBoundary && entryDate < fromBoundary) {
      return false;
    }
    if (toBoundary && entryDate > toBoundary) {
      return false;
    }
    return true;
  });
}

function applyDetailSearch(entries, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    return entries;
  }

  const query = searchQuery.toLowerCase();
  return entries.filter((entry) => {
    const href = (entry.href || "").toLowerCase();
    const label = (entry.label || "").toLowerCase();
    return href.includes(query) || label.includes(query);
  });
}

function paginateEntries(entries, page, perPage) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return entries.slice(startIndex, endIndex);
}

function updatePaginationControls(currentPage, totalEntries, perPage) {
  if (!detailsPagination || !detailsPrevPage || !detailsNextPage || !detailsPaginationInfo) {
    return;
  }

  const totalPages = Math.ceil(totalEntries / perPage);

  if (totalPages <= 1) {
    detailsPagination.style.display = "none";
    return;
  }

  detailsPagination.style.display = "flex";

  detailsPrevPage.disabled = currentPage <= 1;
  detailsNextPage.disabled = currentPage >= totalPages;

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalEntries);
  const totalPagesSafe = Math.max(totalPages, 1);

  detailsPaginationInfo.textContent = t("details.pagination.info", {
    start: numberFormatter.format(startItem),
    end: numberFormatter.format(endItem),
    total: numberFormatter.format(totalEntries),
    current: numberFormatter.format(currentPage),
    pages: numberFormatter.format(totalPagesSafe),
  });
}

function updateTablePaginationControls(currentPage, totalEntries, perPage) {
  if (!tablePagination || !tablePrevPage || !tableNextPage || !tablePaginationInfo) {
    return;
  }

  const totalPages = Math.ceil(totalEntries / perPage);
  if (totalPages <= 1) {
    tablePagination.style.display = "none";
    return;
  }

  tablePagination.style.display = "flex";
  tablePrevPage.disabled = currentPage <= 1;
  tableNextPage.disabled = currentPage >= totalPages;

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalEntries);
  tablePaginationInfo.textContent = t("details.pagination.info", {
    start: numberFormatter.format(startItem),
    end: numberFormatter.format(endItem),
    total: numberFormatter.format(totalEntries),
    current: numberFormatter.format(currentPage),
    pages: numberFormatter.format(Math.max(totalPages, 1)),
  });
}

function parseFilterDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function compareDetailEntriesByDateDesc(a, b) {
  if (!a || !b) {
    return 0;
  }
  if (!a.lastModIso && !b.lastModIso) {
    return 0;
  }
  if (!a.lastModIso) {
    return 1;
  }
  if (!b.lastModIso) {
    return -1;
  }
  return new Date(b.lastModIso).getTime() - new Date(a.lastModIso).getTime();
}

function getFilteredDetailEntriesSnapshot() {
  if (!Array.isArray(state.detailEntries) || !state.detailEntries.length) {
    return [];
  }

  const filteredByDate = applyDetailFilters(state.detailEntries, state.detailFilters);
  const filteredBySearch = applyDetailSearch(filteredByDate, state.detailSearchQuery);
  const filteredByPrefix = filterEntriesByPrefix(filteredBySearch, state.detailPrefixFilter);
  const filteredByIssue = filterEntriesByIssue(filteredByPrefix, state.detailIssueFilter);

  return filteredByIssue.slice().sort(compareDetailEntriesByDateDesc);
}
function createDetailsEmptyRow(message) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 10;
  td.classList.add("empty-state");
  td.textContent = message;
  tr.appendChild(td);
  return tr;
}

function handleSitemapsExport(kind) {
  const items = getExportableSitemaps();
  if (!items.length) {
    showToast(t("controls.export.noData"), "error");
    return;
  }

  try {
    const filename = buildSitemapsExportFilename(kind === "json" ? "json" : "csv");
    if (kind === "json") {
      const jsonContent = JSON.stringify(items, null, 2);
      downloadJsonContent(jsonContent, filename);
    } else {
      const csvContent = buildSitemapsCsvContent(items);
      downloadCsvContent(csvContent, filename);
    }
    showToast(t("controls.export.success"), "success");
  } catch (error) {
    console.error("Sitemaps export failed", error);
    showToast(t("controls.export.error"), "error");
  }
}

function getExportableSitemaps() {
  return state.sitemaps
    .map((item) => {
      if (!item || !item.url) {
        return null;
      }
      return {
        title: item.title || item.url,
        url: item.url,
        domain: item.domain || extractDomain(item.url),
        sourceType: item.sourceType || "sitemap",
        tags: Array.isArray(item.tags) ? item.tags : [],
      };
    })
    .filter(Boolean);
}

function buildSitemapsCsvContent(entries) {
  const header = ["Title", "URL", "Domain", "Source", "Tags"];
  const rows = entries.map((entry) => [
    entry.title || "",
    entry.url || "",
    entry.domain || "",
    entry.sourceType || "",
    (entry.tags || []).join("|"),
  ]);
  const delimiter = ";";
  const csvRows = [header, ...rows]
    .map((row) => row.map(csvEscapeValue).join(delimiter))
    .join("\n");
  return `\uFEFFsep=${delimiter}\n${csvRows}`;
}

function buildSitemapsExportFilename(extension) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `sitemaps-${timestamp}.${extension}`;
}

function handleDetailsExportClick() {
  if (state.isLoadingDetails) {
    showToast(t("details.export.loading"), "info");
    return;
  }

  const entries = getFilteredDetailEntriesSnapshot();
  if (!entries.length) {
    showToast(t("details.export.noData"), "error");
    return;
  }

  try {
    const csvContent = buildDetailsCsvContent(entries);
    const filename = buildDetailsExportFilename();
    downloadCsvContent(csvContent, filename);
    showToast(t("details.export.success"), "success");
  } catch (error) {
    console.error("Details export failed", error);
    showToast(t("details.export.error"), "error");
  }
}

function buildDetailsCsvContent(entries) {
  const header = [t("details.table.link"), t("details.table.lastUpdated")];
  const rows = entries.map((entry) => [
    entry.href || entry.label || "",
    entry.lastMod || t("datetime.unknown"),
  ]);
  const delimiter = ";";
  const csvRows = [header, ...rows]
    .map((row) => row.map(csvEscapeValue).join(delimiter))
    .join("\n");
  return `\uFEFFsep=${delimiter}\n${csvRows}`;
}

function csvEscapeValue(value) {
  const stringValue = value == null ? "" : String(value);
  if (/[";,\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function buildDetailsExportFilename() {
  const baseName =
    (state.selected && (state.selected.title || state.selected.domain || state.selected.url)) ||
    "sitemap";
  const slug = slugifyForExport(baseName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${slug}-${timestamp}.csv`;
}

function slugifyForExport(value) {
  if (!value) {
    return "sitemap";
  }
  return (
    value
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sitemap"
  );
}

function downloadCsvContent(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function downloadJsonContent(content, filename) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function showToast(message, tone = "info") {
  if (!toastContainer || !message) {
    return;
  }

  const normalizedTone = tone === "error" ? "error" : tone === "success" ? "success" : "info";
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast--${normalizedTone}`);
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  const lifetime = 4500;
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, lifetime);
}

function setStatus(message, tone = "info", options = {}) {
  if (!statusBox) {
    return;
  }
  const useHtml = options && options.html;
  if (Array.isArray(message)) {
    statusBox.innerHTML = "";
    message.forEach((part) => {
      if (part == null) {
        return;
      }
      if (typeof part === "string") {
        statusBox.append(part);
      } else if (part instanceof Node) {
        statusBox.append(part);
      } else {
        statusBox.append(String(part));
      }
    });
  } else if (useHtml) {
    statusBox.innerHTML = message || "";
  } else {
    statusBox.textContent = message || "";
  }
  const normalizedTone = tone === "error" ? "error" : tone === "success" ? "success" : "info";
  statusBox.classList.remove("status--info", "status--success", "status--error");
  statusBox.classList.add(`status--${normalizedTone}`);

  const shouldToast =
    typeof options.toast === "boolean" ? options.toast : normalizedTone !== "info";
  if (shouldToast && message) {
    showToast(message, normalizedTone);
  }
}

function toggleLoading(isLoading) {
  refreshButton.disabled = isLoading;
  refreshButton.textContent = t(isLoading ? "controls.refreshLoading" : "controls.refresh");
}

function createIcon(name, size = 18) {
  const icon = document.createElement("iconify-icon");
  icon.setAttribute("icon", name);
  icon.setAttribute("width", String(size));
  icon.setAttribute("height", String(size));
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function decorateButton(button, iconName, label) {
  button.textContent = "";
  const icon = createIcon(iconName);
  const text = document.createElement("span");
  text.textContent = label;
  button.append(icon, text);
}

function getNotificationErrorMessage(reason) {
  switch (reason) {
    case "unsupported":
      return t("notifications.unsupported");
    case "denied":
      return t("notifications.error.denied");
    case "error":
    default:
      return t("notifications.error.generic");
  }
}

function setDetailStatus(message) {
  detailsStatus.textContent = message;
}

function debounce(fn, wait = UI_INPUT_DEBOUNCE_MS) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, wait);
  };
}

function setDetailsExportEnabled(canExport) {
  if (!detailsExportButton) {
    return;
  }
  detailsExportButton.disabled = !canExport;
}

function setDetailsScanEnabled(canScan) {
  if (!detailsScanButton) {
    return;
  }
  detailsScanButton.disabled = !canScan;
}

function setDetailsPauseEnabled(canPause) {
  if (!detailsPauseButton) {
    return;
  }
  detailsPauseButton.disabled = !canPause;
}

function setDetailsStopEnabled(canStop) {
  if (!detailsStopButton) {
    return;
  }
  detailsStopButton.disabled = !canStop;
}

function setDetailsPauseLabel(isPaused) {
  if (!detailsPauseButton) {
    return;
  }
  detailsPauseButton.textContent = t(isPaused ? "details.scanResumeButton" : "details.scanPauseButton");
}
function enterEditMode(url) {
  state.tagInputUrl = null;
  state.editingUrl = url;
  renderTable();
}

function cancelEditMode() {
  state.tagInputUrl = null;
  state.editingUrl = null;
  renderTable();
}

function commitTitleChange(url, rawValue) {
  state.tagInputUrl = null;
  const normalizedUrl = url.toLowerCase();
  const nextTitle = rawValue ? rawValue.trim() : "";
  const finalTitle = nextTitle || url;

  const sitemapItem = state.sitemaps.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (!sitemapItem) {
    state.editingUrl = null;
    renderTable();
    setStatus(t("status.sitemap.notFound"));
    return;
  }

  if (sitemapItem.title === finalTitle) {
    state.editingUrl = null;
    renderTable();
    setStatus(t("status.title.unchanged"));
    return;
  }

  sitemapItem.title = finalTitle;
  persistSitemaps(state.sitemaps);

  const rowItem = state.rows.find((item) => item.url.toLowerCase() === normalizedUrl);
  if (rowItem) {
    rowItem.title = finalTitle;
  }

  if (state.selected && state.selected.url.toLowerCase() === normalizedUrl) {
    state.selected.title = finalTitle;
    renderDetails();
  }

  state.editingUrl = null;
  renderTable();
  setStatus(t("status.title.updated"));
}

function enterTagInput(url) {
  state.editingUrl = null;
  state.tagInputUrl = url;
  renderTable();
}

function cancelTagInput() {
  state.tagInputUrl = null;
  renderTable();
}

function parseEmailInput(value) {
  if (typeof value !== "string") {
    return [];
  }
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function enterEmailEdit(url) {
  state.emailEditUrl = url;
  state.expandedRow = url;
  renderTable();
}

function cancelEmailEdit() {
  state.emailEditUrl = null;
  renderTable();
}

function commitEmailSettings(url, rawInput, enabled) {
  const normalizedUrl = url.toLowerCase();
  const sitemapItem = state.sitemaps.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (!sitemapItem) {
    setStatus(t("status.sitemap.notFound"));
    return;
  }

  const displayTitle = sitemapItem.title || url;
  const recipients = sanitizeEmails(parseEmailInput(rawInput));
  const nextEnabled = Boolean(enabled) && recipients.length > 0;

  if (enabled && !recipients.length) {
    setStatus(t("status.email.requireRecipient"));
    return;
  }

  sitemapItem.emailRecipients = recipients;
  sitemapItem.emailEnabled = nextEnabled;

  const rowItem = state.rows.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );
  if (rowItem) {
    rowItem.emailRecipients = [...recipients];
    rowItem.emailEnabled = nextEnabled;
  }

  if (state.selected && state.selected.url.toLowerCase() === normalizedUrl) {
    state.selected.emailRecipients = [...recipients];
    state.selected.emailEnabled = nextEnabled;
  }

  persistSitemaps(state.sitemaps);
  notificationManager.record(state.rows);
  if (nextEnabled) {
    notificationManager.ensurePolling();
  }
  state.emailEditUrl = null;
  renderTable();

  let statusMessage;
  if (recipients.length) {
    statusMessage = `${displayTitle} icin ${recipients.length} e-posta alicisi kaydedildi${nextEnabled ? " ve bildirimler acildi." : "."}`;
  } else {
    statusMessage = `${displayTitle} icin e-posta alicilari temizlendi.`;
  }

  if (nextEnabled && !state.brevoSettings.hasApiKey) {
    statusMessage +=
      " (Uyari: Brevo API anahtari tanimli degil, e-postalar gonderilemeyebilir. Ayarlar sayfasindan API anahtari ekleyin.)";
  } else if (nextEnabled && state.brevoSettings.hasApiKey && !state.brevoSettings.senderEmail) {
    statusMessage +=
      " (Uyari: Gonderici e-posta adresi tanimli degil. Ayarlar sayfasindan gonderici bilgilerini guncelleyebilirsiniz.)";
  }

  setStatus(statusMessage);
}
function setNotificationPreference(url, value) {
  const normalizedUrl = url.toLowerCase();
  const sitemapItem = state.sitemaps.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (!sitemapItem) {
    setStatus(t("status.sitemap.notFound"));
    return false;
  }

  const nextValue = Boolean(value);
  sitemapItem.notificationsEnabled = nextValue;

  const rowItem = state.rows.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );
  if (rowItem) {
    rowItem.notificationsEnabled = nextValue;
  }

  persistSitemaps(state.sitemaps);
  notificationManager.record(state.rows);
  return true;
}


async function requestEmailSend({ url, subject, htmlContent, textContent, isTest = false }) {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("E-posta gondermek icin gecerli bir URL gerekli.");
  }

  const payload = {
    url,
    subject,
    htmlContent,
    textContent,
    isTest: Boolean(isTest),
  };

  const response = await fetch(API_EMAIL_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.json().catch(() => ({}));
}

async function sendEmailTest(row) {
  try {
    const response = await requestEmailSend({
      url: row.url,
      subject: `[SitemapFlow] Test: ${row.title || row.url}`,
      htmlContent: `<p>Bu bir test e-postasidir.</p><p>Sitemap: <a href="${row.url}" target="_blank" rel="noopener noreferrer">${row.url}</a></p>`,
      textContent: `Bu bir test e-postasidir.\nSitemap: ${row.url}`,
      isTest: true,
    });
    if (response && typeof response.message === "string" && response.message.trim()) {
      return response.message.trim();
    }
    return true;
  } catch (error) {
    console.warn("Test e-postasi gonderilemedi:", error);
    setStatus(error.message || "Test e-postasi gonderilemedi.", "error");
    return false;
  }
}
function commitTagAddition(url, rawValue) {
  const normalizedUrl = url.toLowerCase();
  const sitemapItem = state.sitemaps.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (!sitemapItem) {
    setStatus(t("status.sitemap.notFound"));
    state.tagInputUrl = null;
    renderTable();
    return;
  }

  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) {
    setStatus(t("status.tag.enter"));
    return;
  }

  const normalized = normalizeTag(value);
  if (!normalized) {
    setStatus(t("status.tag.enter"));
    return;
  }

  const currentTags = Array.isArray(sitemapItem.tags) ? sitemapItem.tags : [];

  if (currentTags.some((tag) => normalizeTag(tag) === normalized)) {
    setStatus(t("status.tag.duplicate"));
    return;
  }

  const updatedTags = [...currentTags, value];
  sitemapItem.tags = sanitizeTags(updatedTags);

  const rowItem = state.rows.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (rowItem) {
    rowItem.tags = [...sitemapItem.tags];
  }

  if (state.selected && state.selected.url.toLowerCase() === normalizedUrl) {
    state.selected.tags = [...sitemapItem.tags];
  }

  persistSitemaps(state.sitemaps);
  state.tagInputUrl = null;

  renderTagMenu();
  renderTable();
  setStatus(t("status.tag.added"));
}

function removeTag(url, tagValue) {
  const normalizedUrl = url.toLowerCase();
  const targetTag = normalizeTag(tagValue);

  if (!targetTag) {
    return;
  }

  const sitemapItem = state.sitemaps.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (!sitemapItem) {
    setStatus(t("status.sitemap.notFound"));
    state.tagInputUrl = null;
    renderTable();
    return;
  }

  const currentTags = Array.isArray(sitemapItem.tags) ? sitemapItem.tags : [];
  const filtered = currentTags.filter(
    (tag) => normalizeTag(tag) !== targetTag
  );

  if (filtered.length === currentTags.length) {
    setStatus(t("status.tag.notFound"));
    return;
  }

  const newTags = sanitizeTags(filtered);
  sitemapItem.tags = newTags;

  const rowItem = state.rows.find(
    (item) => item.url.toLowerCase() === normalizedUrl
  );

  if (rowItem) {
    rowItem.tags = [...newTags];
  }

  if (state.selected && state.selected.url.toLowerCase() === normalizedUrl) {
    state.selected.tags = [...newTags];
    if (
      state.selectedTag &&
      !state.selected.tags.some(
        (tag) => normalizeTag(tag) === normalizeTag(state.selectedTag)
      )
    ) {
      resetDetails();
    }
  }

  state.tagInputUrl = null;

  persistSitemaps(state.sitemaps);
  renderTagMenu();
  renderTable();
  setStatus(t("status.tag.removed"));
}

function renderDomainMenu() {
  if (!domainFilter) {
    return;
  }

  const rowsForCounts = state.rows.filter((row) => matchesNonDomainFilters(row));
  const domainTotals = new Map();
  let overallTotal = 0;

  for (const row of rowsForCounts) {
    const value =
      typeof row.totalEntries === "number" ? row.totalEntries : Number(row.totalEntries);
    if (!Number.isFinite(value)) {
      continue;
    }
    overallTotal += value;
    if (row.domain) {
      domainTotals.set(row.domain, (domainTotals.get(row.domain) || 0) + value);
    }
  }

  if (
    state.selectedDomain &&
    !state.sitemaps.some((item) => item.domain === state.selectedDomain)
  ) {
    state.selectedDomain = null;
  }

  domainFilter.innerHTML = "";

  if (!state.sitemaps.length) {
    const empty = document.createElement("span");
    empty.classList.add("domain__empty");
    empty.textContent = t("status.sitemap.none");
    domainFilter.appendChild(empty);
    return;
  }

  const domains = Array.from(
    new Set(
      state.sitemaps
        .map((item) => item.domain)
        .filter((value) => Boolean(value))
    )
  ).sort();

  domainFilter.appendChild(createDomainButton(t("filters.all"), null, overallTotal));

  for (const domain of domains) {
    domainFilter.appendChild(
      createDomainButton(domain, domain, domainTotals.get(domain) ?? 0)
    );
  }
}

function createDomainButton(label, value, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("domain__button");

  const isActive =
    (value === null && state.selectedDomain === null) || state.selectedDomain === value;

  if (isActive) {
    button.classList.add("domain__button--active");
  }

  const safeCount = typeof count === "number" && Number.isFinite(count) ? count : null;
  const { text, ariaLabel } = formatLabelWithCount(label, safeCount ?? undefined);
  button.textContent = text;
  if (ariaLabel) {
    button.setAttribute("aria-label", ariaLabel);
  }
  button.addEventListener("click", () => {
    if (value === null) {
      state.selectedDomain = null;
    } else if (state.selectedDomain === value) {
      state.selectedDomain = null;
    } else {
      state.selectedDomain = value;
    }

    if (state.editingUrl) {
      state.editingUrl = null;
    }
    state.tablePage = 1;

    renderDomainMenu();
    renderTable();

    if (state.selectedDomain) {
      showDomainDetails(state.selectedDomain);
    } else {
      resetDetails();
      renderDetails();
    }
  });

  return button;
}

function renderTagMenu() {
  if (!tagFilter) {
    return;
  }

  const tagSet = new Map();

  for (const item of state.sitemaps) {
    const tags = sanitizeTags(item.tags);
    item.tags = tags;
    for (const tag of tags) {
      const normalized = normalizeTag(tag);
      if (!tagSet.has(normalized)) {
        tagSet.set(normalized, tag);
      }
    }
  }

  for (const row of state.rows) {
    const match = state.sitemaps.find((item) => item.url === row.url);
    if (match) {
      row.tags = [...match.tags];
    }
  }

  if (
    state.selectedTag &&
    !Array.from(tagSet.keys()).some(
      (key) => key === normalizeTag(state.selectedTag)
    )
  ) {
    state.selectedTag = null;
  }

  tagFilter.innerHTML = "";

  if (!tagSet.size) {
    const empty = document.createElement("span");
    empty.classList.add("tags__empty");
    empty.textContent = t("tags.empty");
    tagFilter.appendChild(empty);
    return;
  }

  tagFilter.appendChild(createTagButton(t("filters.all"), null));

  const sortedTags = Array.from(tagSet.values()).sort((a, b) =>
    a.localeCompare(b, "tr", { sensitivity: "base" })
  );

  for (const tag of sortedTags) {
    tagFilter.appendChild(createTagButton(tag, tag));
  }
}

function createTagButton(label, value) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("tags__button");

  const isActive =
    (value === null && state.selectedTag === null) ||
    (value !== null &&
      state.selectedTag !== null &&
      normalizeTag(state.selectedTag) === normalizeTag(value));

  if (isActive) {
    button.classList.add("tags__button--active");
  }

  button.textContent = label;
  button.addEventListener("click", () => {
    let nextTag = null;

    if (value === null) {
      nextTag = null;
    } else if (
      state.selectedTag &&
      normalizeTag(state.selectedTag) === normalizeTag(value)
    ) {
      nextTag = null;
    } else {
      nextTag = value;
    }

    state.selectedTag = nextTag;

    const selectedTags = Array.isArray(state.selected?.tags)
      ? state.selected.tags
      : [];

    if (
      state.selected &&
      nextTag &&
      !selectedTags.some((tag) => normalizeTag(tag) === normalizeTag(nextTag))
    ) {
      resetDetails();
    }

    state.editingUrl = null;
    state.tagInputUrl = null;
    state.tablePage = 1;

    renderTagMenu();
    renderTable();
  });

  return button;
}

function removeSitemap(entry) {
  const targetUrl = entry && typeof entry.url === "string" ? entry.url.trim() : "";
  if (!targetUrl) {
    setStatus("Gecerli bir URL bulunamadi.");
    return;
  }

  const normalizedUrl = targetUrl.toLowerCase();
  const match = state.sitemaps.find((item) => item.url.toLowerCase() === normalizedUrl);
  const sourceType = normalizeSourceType(match?.sourceType || entry?.sourceType);
  const sourceLabel = getSourceLabel(sourceType);

  if (!match) {
    setStatus(`${sourceLabel} listede bulunamadi.`);
    return;
  }

  state.sitemaps = state.sitemaps.filter((item) => item.url.toLowerCase() !== normalizedUrl);

  if (state.editingUrl && state.editingUrl.toLowerCase() === normalizedUrl) {
    state.editingUrl = null;
  }

  persistSitemaps(state.sitemaps);
  renderDomainMenu();
  renderTagMenu();

  state.rows = state.rows.filter((row) => row.url.toLowerCase() !== normalizedUrl);

  if (state.selected && state.selected.url.toLowerCase() === normalizedUrl) {
    resetDetails();
  } else {
    renderDetails();
  }

  renderTable();

  setStatus(`${sourceLabel} listeden kaldirildi.`);
}

function confirmSitemapRemoval(entry) {
  if (!entry) {
    setStatus("Gecerli bir kaynak secilemedi.");
    return;
  }
  const displayTitle = entry.title || entry.url;
  const sourceType = normalizeSourceType(entry.sourceType);
  const sourceLabel = getSourceLabel(sourceType);
  const sourceLabelLower = getSourceLabel(sourceType, { lowercase: true });
  const message = `"${displayTitle}" ${sourceLabelLower} kaldirmak istediginizden emin misiniz?`;

  const shouldRemove = window.confirm(message);
  if (!shouldRemove) {
    setStatus(`${sourceLabel} kaldirma islemi iptal edildi.`);
    return;
  }

  removeSitemap(entry);
}
function addSourceEntry({
  type = DEFAULT_SOURCE_TYPE,
  titleInput,
  urlInput,
  form,
  presetTitle,
  presetUrl,
} = {}) {
  const normalizedType = normalizeSourceType(type);
  const title =
    typeof presetTitle === "string"
      ? presetTitle.trim()
      : titleInput
      ? titleInput.value.trim()
      : "";
  const urlValue =
    typeof presetUrl === "string"
      ? presetUrl.trim()
      : urlInput
      ? urlInput.value.trim()
      : "";
  const sourceLabel = getSourceLabel(normalizedType);
  const sourceLabelLower = getSourceLabel(normalizedType, { lowercase: true });

  if (!urlValue) {
    setStatus(`Lutfen ${sourceLabelLower} URL alanini doldurun.`);
    if (urlInput) {
      urlInput.focus();
    }
    return false;
  }

  let parsed;
  try {
    parsed = new URL(urlValue);
  } catch (error) {
    setStatus("Gecerli bir URL girin (http veya https).");
    if (urlInput) {
      urlInput.focus();
    }
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    setStatus("Sadece http veya https adresleri kabul edilir.");
    if (urlInput) {
      urlInput.focus();
    }
    return false;
  }

  const normalizedUrl = parsed.href;
  const exists = state.sitemaps.some(
    (item) => item.url.toLowerCase() === normalizedUrl.toLowerCase()
  );

  if (exists) {
    setStatus(`${sourceLabel} zaten listede.`);
    if (urlInput) {
      urlInput.focus();
    }
    return false;
  }

  const label = title || normalizedUrl;
  const domain = extractDomain(normalizedUrl);
  state.sitemaps.push({
    title: label,
    url: normalizedUrl,
    domain,
    tags: [],
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
    sourceType: normalizedType,
  });
  persistSitemaps(state.sitemaps);
  renderDomainMenu();
  renderTagMenu();
  if (form) {
    form.reset();
  }
  setStatus(`${sourceLabel} listeye eklendi. Veriler yukleniyor...`);

  // Avoid reloading every sitemap on add; hydrate only the new source to keep the UI responsive.
  const existingIndex = state.rows.findIndex((row) => row && row.url === normalizedUrl);
  const placeholder = {
    title: label,
    url: normalizedUrl,
    domain,
    tags: [],
    sourceType: normalizedType,
    totalEntries: 0,
    latestDate: t("controls.refreshLoading"),
    latestDateIso: null,
    rootType: "loading",
    rawXml: null,
    recentEntries: [],
    error: null,
    errorType: null,
    errorCode: null,
    removable: true,
    updateRate: { average: 0, total: 0, label: "-" },
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
  };
  if (existingIndex === -1) {
    state.rows.unshift(placeholder);
  } else {
    state.rows[existingIndex] = placeholder;
  }
  renderDomainMenu();
  renderTagMenu();
  renderTable();

  const config = state.sitemaps.find((item) => item && item.url === normalizedUrl);
  if (config) {
    buildRowFromConfig(config)
      .then((row) => {
        const idx = state.rows.findIndex((item) => item && item.url === normalizedUrl);
        if (idx !== -1) {
          state.rows[idx] = row;
        } else {
          state.rows.unshift(row);
        }
        notificationManager.record(state.rows);
        renderDomainMenu();
        renderTagMenu();
        renderTable();
      })
      .catch(handleLoadError);
  }
  return true;
}

function handleAddSitemap(event) {
  event.preventDefault();
  addSourceEntry({
    type: DEFAULT_SOURCE_TYPE,
    titleInput: addTitleInput,
    urlInput: addUrlInput,
    form: addForm,
  });
}

function handleAddFeed(event) {
  event.preventDefault();
  addSourceEntry({
    type: "rss",
    titleInput: addFeedTitleInput,
    urlInput: addFeedUrlInput,
    form: addFeedForm,
  });
}

function handleLoadError(error) {
  console.error("Sitemap'ler yÃƒÂ¼klenirken beklenmedik bir hata oluÃ…Å¸tu:", error);
  setStatus("Sitemap'ler yÃƒÂ¼klenirken beklenmedik bir hata oluÃ…Å¸tu.");
}

// Chart.js grafik yÃƒÂ¶netimi
let detailsChart = null;
const detailsChartContainer = document.getElementById("detailsChartContainer");
const detailsChartCanvas = document.getElementById("detailsChart");

function formatLocalDateKey(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return `${copy.getFullYear()}-${String(copy.getMonth() + 1).padStart(2, "0")}-${String(
    copy.getDate()
  ).padStart(2, "0")}`;
}

function groupEntriesByDay(entries, days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDays = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    lastDays.push({
      date,
      dateStr: formatLocalDateKey(date),
      count: 0,
    });
  }

  entries.forEach((entry) => {
    if (!entry.lastModIso) {
      return;
    }
    const entryDate = new Date(entry.lastModIso);
    const entryDateStr = formatLocalDateKey(entryDate);
    const dayData = lastDays.find((day) => day.dateStr === entryDateStr);
    if (dayData) {
      dayData.count++;
    }
  });

  return lastDays;
}


function calculateDailyUpdateRate(xmlText, days = 7, baseUrl = null, precomputedEntries = null) {
  const empty = { average: 0, total: 0, label: t("updateRate.none") };
  let entries = Array.isArray(precomputedEntries) ? precomputedEntries : null;

  if (!entries) {
    if (!xmlText) {
      return empty;
    }
    try {
      const doc = parseXml(xmlText);
      const type = doc.documentElement.nodeName.toLowerCase();
      entries = extractEntries(doc, type, baseUrl);
    } catch (error) {
      return empty;
    }
  }

  if (!entries.length) {
    return empty;
  }

  const dailyData = groupEntriesByDay(entries, days);
  const totalUpdates = dailyData.reduce((sum, day) => sum + day.count, 0);
  const average = totalUpdates / days;

  return {
    average,
    total: totalUpdates,
    label: formatUpdateRateLabel(average),
  };
}

function formatUpdateRateLabel(average) {
  if (average >= 10) {
    return t("updateRate.perDay", { value: Math.round(average) });
  }
  if (average >= 1) {
    return t("updateRate.perDay", { value: average.toFixed(1) });
  }
  if (average > 0) {
    const weeklyAvg = average * 7;
    return t("updateRate.perWeek", { value: weeklyAvg.toFixed(1) });
  }
  return t("updateRate.none");
}

function renderDetailsChart(entries) {
  if (!detailsChartContainer || !detailsChartCanvas) return;

  if (!entries || entries.length === 0) {
    detailsChartContainer.style.display = 'none';
    if (detailsChart) {
      detailsChart.destroy();
      detailsChart = null;
    }
    return;
  }

  const chartTitle = document.getElementById('detailsChartTitle');
  if (chartTitle) {
    chartTitle.textContent = t("details.chart.titleDynamic", { days: state.chartDaysFilter });
  }

  const dailyData = groupEntriesByDay(entries, state.chartDaysFilter);
  const locale = getIntlLocale(currentLanguage);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatLocalDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatLocalDateKey(yesterday);

  const labels = dailyData.map((day) => {
    const date = new Date(day.date);

    if (day.dateStr === todayKey) {
      return t("details.chart.label.today");
    }

    if (day.dateStr === yesterdayKey) {
      return t("details.chart.label.yesterday");
    }

    return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
  });
  const counts = dailyData.map((day) => day.count);

  detailsChartContainer.style.display = 'block';
  detailsChartCanvas.style.height = '240px';

  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue('--accent').trim() || '#2563eb';
  const textColor = rootStyles.getPropertyValue('--text').trim() || '#1f2933';
  const borderColor = rootStyles.getPropertyValue('--border').trim() || '#e2e8f0';
  const chartFill = accentColor.replace(')', ', 0.1)').replace('rgb', 'rgba');

  if (detailsChart) {
    detailsChart.data.labels = labels;
    if (!Array.isArray(detailsChart.data.datasets) || !detailsChart.data.datasets.length) {
      detailsChart.data.datasets = [{ data: counts }];
    }
    const dataset = detailsChart.data.datasets[0];
    dataset.label = t("details.chart.seriesLabel");
    dataset.data = counts;
    dataset.borderColor = accentColor;
    dataset.backgroundColor = chartFill;
    dataset.pointBackgroundColor = accentColor;
    dataset.pointHoverBackgroundColor = accentColor;

    if (detailsChart.options && detailsChart.options.scales) {
      if (detailsChart.options.scales.y) {
        if (detailsChart.options.scales.y.ticks) {
          detailsChart.options.scales.y.ticks.color = textColor;
        }
        if (detailsChart.options.scales.y.grid) {
          detailsChart.options.scales.y.grid.color = borderColor;
        }
      }
      if (detailsChart.options.scales.x) {
        if (detailsChart.options.scales.x.ticks) {
          detailsChart.options.scales.x.ticks.color = textColor;
        }
        if (detailsChart.options.scales.x.grid) {
          detailsChart.options.scales.x.grid.color = borderColor;
        }
      }
    }
    detailsChart.update("none");
    return;
  }

  detailsChart = new Chart(detailsChartCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: t("details.chart.seriesLabel"),
          data: counts,
          borderColor: accentColor,
          backgroundColor: chartFill,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: accentColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: accentColor,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13,
            weight: 'bold',
          },
          bodyFont: {
            size: 12,
          },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label(context) {
              const value = numberFormatter.format(context.parsed.y);
              return t("details.chart.tooltip", { count: value });
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: textColor,
            font: {
              size: 11,
            },
          },
          grid: {
            color: borderColor,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
          },
          grid: {
            color: borderColor,
            drawBorder: false,
          },
        },
      },
    },
  });
}

function initializeChartFilters() {
  const chartFilterButtons = document.querySelectorAll('.details__chart-filter');

  chartFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const days = parseInt(button.getAttribute('data-days'), 10);
      if (isNaN(days)) return;

      // State'i gÃƒÂ¼ncelle
      state.chartDaysFilter = days;

      // Aktif buton stilini gÃƒÂ¼ncelle
      chartFilterButtons.forEach(btn => btn.classList.remove('details__chart-filter--active'));
      button.classList.add('details__chart-filter--active');

      // GrafiÃ„Å¸i yeniden render et
      if (state.detailEntries && state.detailEntries.length > 0) {
        renderDetailsChart(state.detailEntries);
      }
    });
  });
}

// Logout handler
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.href = '/login.html';
      } else {
        alert('Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yapÃ„Â±lÃ„Â±rken hata oluÃ…Å¸tu');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yapÃ„Â±lÃ„Â±rken hata oluÃ…Å¸tu');
    }
  });
}

async function checkAuthentication() {
  try {
    const response = await fetch('/api/check-auth', {
      cache: 'no-store'
    });
    const data = await response.json();

    if (!data.authenticated) {
      window.location.href = '/login.html';
      return null;
    }

    return data;
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.href = '/login.html';
    return null;
  }
}

async function bootstrap() {
  // Ã„Â°lk olarak authentication kontrolÃƒÂ¼ yap
  const authData = await checkAuthentication();
  if (!authData) {
    return; // Login sayfasÃ„Â±na yÃƒÂ¶nlendiriliyor
  }

  // Username'i gÃƒÂ¼ncelle
  const userNameElement = document.getElementById('userName');
  if (userNameElement && authData.username) {
    userNameElement.textContent = authData.username;
  }

  await brevoManager.loadSettings();

  // Ã„Â°lk yÃƒÂ¼klemede skeleton gÃƒÂ¶ster
  showSkeletonLoader(3);

  initializeDetailPrefixMenu();
  initializeChartFilters();
  await syncSitemapsFromServer(true);
  await loadSitemaps();
}

bootstrap().catch(handleLoadError);




















































function sanitizeDiscoveryResults(results) {
  if (!Array.isArray(results) || !results.length) {
    return [];
  }
  const existing = new Set(
    state.sitemaps.map((item) => (item && item.url ? item.url.toLowerCase() : "")).filter(Boolean)
  );
  const seen = new Set();
  const sanitized = [];
  for (const entry of results) {
    if (!entry || typeof entry.url !== "string") {
      continue;
    }
    let normalized;
    try {
      normalized = new URL(entry.url).href;
    } catch (error) {
      continue;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const verification = {
      ok: Boolean(entry?.verification?.ok),
      statusCode:
        typeof entry?.verification?.statusCode === "number"
          ? entry.verification.statusCode
          : entry?.verification?.statusCode && Number.isFinite(entry.verification.statusCode)
          ? Number(entry.verification.statusCode)
          : null,
      contentType:
        typeof entry?.verification?.contentType === "string"
          ? entry.verification.contentType
          : "",
      reason:
        typeof entry?.verification?.reason === "string"
          ? entry.verification.reason
          : "",
    };
    sanitized.push({
      url: normalized,
      type: normalizeSourceType(entry.type),
      source: entry.source || "guess",
      alreadyExists: existing.has(key),
      verification,
      parent:
        typeof entry.parent === "string" && entry.parent.trim()
          ? entry.parent.trim()
          : "",
      entryCount:
        typeof entry.entryCount === "number" && Number.isFinite(entry.entryCount)
          ? entry.entryCount
          : null,
    });
  }
  return sanitized;
}

function refreshDiscoveryExistingFlags() {
  if (!state.discovery.results.length) {
    return;
  }
  const existing = new Set(
    state.sitemaps.map((item) => (item && item.url ? item.url.toLowerCase() : "")).filter(Boolean)
  );
  state.discovery.results = state.discovery.results.map((entry) => {
    if (!entry || typeof entry.url !== "string") {
      return entry;
    }
    return {
      ...entry,
      alreadyExists: existing.has(entry.url.toLowerCase()),
    };
  });
}

function setDiscoveryLoading(isLoading) {
  if (discoverSubmitButton) {
    discoverSubmitButton.disabled = Boolean(isLoading);
    discoverSubmitButton.textContent = t(isLoading ? "finder.submitLoading" : "finder.submit");
  }
  if (discoverAddSelectedButton) {
    discoverAddSelectedButton.disabled = true;
  }
}

function formatDiscoverySourceLabel(source) {
  const key = `finder.results.source.${source || "guess"}`;
  const value = t(key);
  return value || source || "";
}

function activateAdderTab(tabName) {
  if (!tabName) {
    return;
  }
  adderTabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("adder-tabs__tab--active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  adderTabPanels.forEach((panel) => {
    const matches = panel.dataset.tabPanel === tabName;
    if (matches) {
      panel.removeAttribute("hidden");
      panel.setAttribute("aria-hidden", "false");
    } else {
      panel.setAttribute("hidden", "");
      panel.setAttribute("aria-hidden", "true");
    }
  });
}

function formatDiscoveryStatus(entry) {
  const verification = entry?.verification || {};
  const reason =
    typeof verification.reason === "string" && verification.reason.trim()
      ? verification.reason.trim()
      : "";
  const reasonLabel = reason ? getDiscoveryReasonLabel(reason) : null;

  if (verification.ok) {
    return {
      ok: true,
      text: t("finder.results.status.valid"),
      codeLabel: verification.statusCode
        ? t("finder.results.status.code", { status: verification.statusCode })
        : null,
    };
  }
  const statusLabel = verification.statusCode
    ? t("finder.results.status.code", { status: verification.statusCode })
    : null;
  return {
    ok: false,
    text: reasonLabel || t("finder.results.status.invalid"),
    codeLabel: statusLabel,
  };
}

function getDiscoveryReasonLabel(reason) {
  switch (reason) {
    case "html":
      return t("finder.results.reason.html");
    case "invalid-xml":
      return t("finder.results.reason.invalidXml");
    default:
      return null;
  }
}

function renderDiscoveryResults() {
  if (!discoverStatusElement) {
    return;
  }
  refreshDiscoveryExistingFlags();
  const { isLoading, results, lastQuery, domain, error } = state.discovery;
  const displayDomain = domain || lastQuery || "";
  let statusKey = "finder.status.idle";
  const replacements = {};

  if (isLoading && displayDomain) {
    statusKey = "finder.status.loading";
    replacements.domain = displayDomain;
  } else if (error) {
    statusKey = "finder.status.error";
    replacements.error = error;
  } else if (results.length && displayDomain) {
    statusKey = "finder.status.success";
    replacements.domain = displayDomain;
    replacements.count = results.length;
  } else if (displayDomain && !results.length) {
    statusKey = "finder.status.empty";
    replacements.domain = displayDomain;
  }

  discoverStatusElement.textContent = t(statusKey, replacements);
  setDiscoveryLoading(isLoading);

  if (!discoverListElement) {
    return;
  }

  discoverListElement.innerHTML = "";

  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "finder__empty";
    empty.textContent = t("finder.empty");
    discoverListElement.appendChild(empty);
  } else {
    const helper = document.createElement("div");
    helper.className = "finder__meta-note";
    helper.textContent = t("finder.hint.choose");
    discoverListElement.appendChild(helper);

    results.forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = "finder__item";
      if (entry.alreadyExists) {
        row.classList.add("finder__item--disabled");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "finder__checkbox";
      checkbox.dataset.index = String(index);
      const isVerified = Boolean(entry?.verification?.ok);
      checkbox.disabled = Boolean(entry.alreadyExists || !isVerified);
      row.appendChild(checkbox);

      const body = document.createElement("div");
      body.className = "finder__body";

      const urlEl = document.createElement("div");
      urlEl.className = "finder__url";
      urlEl.textContent = entry.url;
      body.appendChild(urlEl);

      const meta = document.createElement("div");
      meta.className = "finder__meta";
      const sourceBadge = document.createElement("span");
      sourceBadge.className = "finder__pill";
      sourceBadge.textContent = formatDiscoverySourceLabel(entry.source);
      meta.appendChild(sourceBadge);

      const typeBadge = document.createElement("span");
      typeBadge.className = "finder__pill";
      typeBadge.textContent = getSourceLabel(entry.type);
      meta.appendChild(typeBadge);

      const statusInfo = formatDiscoveryStatus(entry);
      const statusBadge = document.createElement("span");
      statusBadge.className = `finder__pill ${
        statusInfo.ok ? "finder__pill--success" : "finder__pill--error"
      }`;
      statusBadge.textContent = statusInfo.text;
      meta.appendChild(statusBadge);

      if (!statusInfo.ok && statusInfo.codeLabel) {
        const codeBadge = document.createElement("span");
        codeBadge.className = "finder__pill finder__pill--error";
        codeBadge.textContent = statusInfo.codeLabel;
        meta.appendChild(codeBadge);
      }

      if (typeof entry.entryCount === "number" && entry.entryCount >= 0) {
        const countBadge = document.createElement("span");
        countBadge.className = "finder__pill";
        countBadge.textContent = t("finder.countLabel", { count: entry.entryCount });
        meta.appendChild(countBadge);
      }

      if (entry.alreadyExists) {
        const added = document.createElement("span");
        added.className = "finder__pill";
        added.textContent = t("finder.results.added");
        meta.appendChild(added);
      }

      body.appendChild(meta);

      if (entry.parent) {
        const parentNote = document.createElement("div");
        parentNote.className = "finder__parent";
        parentNote.textContent = t("finder.parentLabel", { parent: entry.parent });
        body.appendChild(parentNote);
      }
      row.appendChild(body);

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "finder__add-button";
      addButton.dataset.action = "add-single";
      addButton.dataset.index = String(index);
      addButton.textContent = t("finder.addSingle");
      addButton.disabled = Boolean(entry.alreadyExists || !statusInfo.ok);
      row.appendChild(addButton);

      discoverListElement.appendChild(row);
    });
  }

  if (discoverActions) {
    discoverActions.style.display = state.discovery.results.length ? "flex" : "none";
  }

  if (discoverClearButton) {
    discoverClearButton.disabled = !state.discovery.results.length && !state.discovery.lastQuery;
  }

  updateDiscoveryActionState();
}

function updateDiscoveryActionState() {
  if (!discoverAddSelectedButton || !discoverListElement) {
    return;
  }
  if (state.discovery.isLoading) {
    discoverAddSelectedButton.disabled = true;
    return;
  }
  const selectable = Array.from(
    discoverListElement.querySelectorAll(".finder__checkbox:not(:disabled)")
  );
  const hasChecked = selectable.some((input) => input.checked);
  discoverAddSelectedButton.disabled = !hasChecked;
}

async function handleDiscoverSubmit(event) {
  event.preventDefault();
  if (!discoverInput) {
    return;
  }
  const query = discoverInput.value.trim();
  if (!query) {
    discoverStatusElement.textContent = t("finder.status.idle");
    discoverInput.focus();
    return;
  }

  state.discovery.isLoading = true;
  state.discovery.results = [];
  state.discovery.error = null;
  state.discovery.lastQuery = query;
  state.discovery.domain = query;
  renderDiscoveryResults();

  try {
    const response = await fetch(API_DISCOVER_SITEMAPS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target: query }),
    });

    if (!response.ok) {
      const message = await response
        .json()
        .then((data) => (data && data.message) || null)
        .catch(() => null);
      throw new Error(
        message || `${response.status} ${response.statusText || "Beklenmedik hata"}`
      );
    }

    const payload = await response.json().catch(() => ({}));
    const sanitized = sanitizeDiscoveryResults(payload.results || []);
    state.discovery.results = sanitized;
    state.discovery.error = null;
    state.discovery.domain = payload.query || query;
    state.discovery.lastQuery = payload.query || query;
  } catch (error) {
    state.discovery.results = [];
    state.discovery.error = error.message || "Bilinmeyen hata";
  } finally {
    state.discovery.isLoading = false;
    renderDiscoveryResults();
  }
}

function handleDiscoverListClick(event) {
  const button = event.target.closest("[data-action='add-single']");
  if (!button) {
    return;
  }
  const index = Number(button.dataset.index);
  if (!Number.isInteger(index)) {
    return;
  }
  addDiscoveredEntryByIndex(index);
}

function handleDiscoverSelectionChange(event) {
  if (!event.target.classList.contains("finder__checkbox")) {
    return;
  }
  updateDiscoveryActionState();
}

function addDiscoveredEntryByIndex(index) {
  if (!Array.isArray(state.discovery.results) || index < 0) {
    return;
  }
  const entry = state.discovery.results[index];
  if (!entry || entry.alreadyExists || !entry?.verification?.ok) {
    return;
  }
  const success = addSourceEntry({
    type: entry.type,
    presetTitle: entry.url,
    presetUrl: entry.url,
  });
  if (success) {
    state.discovery.results.splice(index, 1);
    renderDiscoveryResults();
  } else {
    refreshDiscoveryExistingFlags();
    renderDiscoveryResults();
  }
}

function handleDiscoverAddSelected() {
  if (!discoverListElement) {
    return;
  }
  const checkboxes = Array.from(
    discoverListElement.querySelectorAll(".finder__checkbox:checked")
  );
  if (!checkboxes.length) {
    return;
  }
  const indexes = [
    ...new Set(
      checkboxes
        .map((input) => Number(input.dataset.index))
        .filter((value) => Number.isInteger(value))
    ),
  ].sort((a, b) => b - a);

  let added = false;
  indexes.forEach((index) => {
    const entry = state.discovery.results[index];
    if (!entry || entry.alreadyExists || !entry?.verification?.ok) {
      return;
    }
    const success = addSourceEntry({
      type: entry.type,
      presetTitle: entry.url,
      presetUrl: entry.url,
    });
    if (success) {
      state.discovery.results.splice(index, 1);
      added = true;
    }
  });

  if (added) {
    renderDiscoveryResults();
  } else {
    updateDiscoveryActionState();
  }
}

function resetDiscoverySection({ clearInput = true } = {}) {
  state.discovery.isLoading = false;
  state.discovery.results = [];
  state.discovery.error = null;
  state.discovery.lastQuery = "";
  state.discovery.domain = "";
  if (clearInput && discoverInput) {
    discoverInput.value = "";
  }
  renderDiscoveryResults();
  if (discoverInput) {
    discoverInput.focus();
  }
}








