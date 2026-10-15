/*
  Locked asset manifest. The visual files below are immutable approved artwork;
  this data is only used for behaviour and verification, never to draw pages.
*/
window.LOCKED_INVITATION = Object.freeze({
  title: "Mahad Aslam & Sidra Arif — Wedding Invitation",
  artwork: Object.freeze({
    sourceWidth: 860,
    sourceHeight: 1720,
    mobileCssWidth: 430,
    mobileCssHeight: 860
  }),
  pages: Object.freeze([
    Object.freeze({ id: "opening", asset: "finalized-jpegs/01-entry.jpeg", sha256: "51616a53fe624aec60cea70668409665a30aca425a6ecd4a3c135d24219bd7a6" }),
    Object.freeze({ id: "couple", asset: "finalized-jpegs/02-hero-countdown.jpeg", sha256: "b06ac3677d3357467d767af16163681daec3f14f44acd1438c7baebd8500ad63" }),
    Object.freeze({ id: "journey", asset: "finalized-jpegs/03-wedding-journey.jpeg", sha256: "0e88d34cf060085d880b0d9d9b93073efb49e349223a4164a175e1b4b50270ff" }),
    Object.freeze({ id: "mehndi", asset: "finalized-jpegs/04-mehndi.jpeg", sha256: "fd1c4326302ceaa2b6bb2047e207d2bc116bb496a100faa8d220df011f3b12b0" }),
    Object.freeze({ id: "female-mehndi-hosts", asset: "finalized-jpegs/05-female-mehndi-hosts.jpeg", sha256: "4d456810168dd580cddcb508e94b68b7c66e6a1ec3ec37f333955a1b23c842be" }),
    Object.freeze({ id: "male-mehndi-hosts", asset: "finalized-jpegs/06-male-mehndi-hosts.jpeg", sha256: "cdd151865f6d0d6ab60d270008c7078e4a0b79e54150737ad30ae4d03344cd5e" }),
    Object.freeze({ id: "barat", asset: "finalized-jpegs/07-barat.jpeg", sha256: "f4e634ebcd1ea99e97fa3ff481fabc35fef51ed7e99b1ca68726b658af599942" }),
    Object.freeze({ id: "walima", asset: "finalized-jpegs/08-walima.jpeg", sha256: "11e66f3f0aa0dfaef14f07adea68ad1158ec8f8609551572ae7436219710c13c" }),
    Object.freeze({ id: "rsvp", asset: "finalized-jpegs/09-rsvp.jpeg", sha256: "6d3c03f9680697710a9e3e1bfdf80bc5f5473c4470cf54a12c7f559b838410c6" }),
    Object.freeze({ id: "looking-forward", asset: "finalized-jpegs/10-looking-forward.jpeg", sha256: "bc59bd976d3dc596e97bd259eb9ab0f72f2c84a9452b95ca3700e6899266dbf6" }),
    Object.freeze({ id: "closing", asset: "finalized-jpegs/11-closing.jpeg", sha256: "adb35b292ae5be7a40c5410e187aa373df6e6c8ba1805a31458233f594a6cdac" })
  ]),
  pageTenShareRemoval: Object.freeze({
    asset: "finalized-jpegs/10-looking-forward-share-removed-repair.png",
    sha256: "533ef160d36119654cf7a08089ad5c0b9974872c03e16f355ca98c8227c89588"
  }),
  countdown: Object.freeze({
    // Main Barat arrival: Saturday, 14 November 2026 at 7:00 PM in Pakistan.
    target: "2026-11-14T19:00:00+05:00",
    timeZone: "Asia/Karachi"
  }),
  share: Object.freeze({
    title: "Mahad Aslam & Sidra — Wedding Invitation",
    text: "You are warmly invited to the wedding celebrations of Mahad Aslam and Sidra Arif."
  })
});
