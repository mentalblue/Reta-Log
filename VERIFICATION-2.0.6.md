# 2.0.6 — category-level supply alerts

- Today supply alerts aggregate usable stock across compatible containers. Default app drug containers (vials, cartridges and pens) share Retatrutide stock; explicitly different substances remain separate.
- BAC water remains separate in mL. Expired, discarded, or opening-information-unknown water is excluded.
- LOW is strictly below the configured threshold; equality is OK. EMPTY means zero usable stock even when the optional LOW threshold is disabled.
- Finished/Archived records are excluded from category alerts and active inventory. A category containing only archived records does not create an alert.
- Equipment is grouped conservatively by type, name/model and compatibility notes, not merely by container type.
- Archive/restore modifies metadata only: supply IDs, injection records, links, and history remain intact. Archived supplies remain accessible through Journal links and the archive section.
- New injection selection cannot select archived stock. Existing historical links remain editable. Duplication creates a fresh active item.
- Current Weight and silent Health Connect behavior from 2.0.5 retained.

Validation: seven core suites passed; browser regression covers dark/light at five widths, silent Health Connect flow, archive/restore UI, historical navigation, new-entry selection and backup metadata preservation.

Full Android build, versionCode 33, existing signing key and application ID. Physical phone installation and live Health Connect provider integration not tested here.
