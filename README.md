# Skillomi LMS + LXP

Frontend prototype for a multi-company learning platform. Data comes from JSON files through a service layer so it can later move to Node.js + Express + MySQL.

## Run

```bash
npm install
npm run dev
```

Demo password for all accounts: `Password123`

- Super Admin: `superadmin@skillomi.test`
- Company Admin (Acme): `admin.acme@skillomi.test`
- Learner: `maya.patel@acme.test`

## Where things live

| Question | Location |
| --- | --- |
| Pages | `src/pages` |
| Components | `src/components` |
| Redux | `src/store` |
| JSON data | `src/data` |
| Services | `src/services` |
| Permissions catalog | `src/data/permissions.json` |
| Permission checks | `src/hooks/usePermissions.js` |
| Routes | `src/routes/AppRoutes.jsx` |
| Theme | `src/constants/theme.js`, `src/store/slices/themeSlice.js` |
