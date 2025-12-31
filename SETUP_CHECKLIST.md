# ✅ Notes Feature - Setup Checklist

## Before You Start
- [ ] Backend server is running (`npm run dev` in backend)
- [ ] Frontend server is running (`npm run dev` in root)
- [ ] You have access to your Supabase dashboard
- [ ] You're logged into the CRM application

## Setup Steps

### 1. Database Migration
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy contents from `migrations/001_create_notes_table.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify success message (no errors)
- [ ] Run verification queries at the bottom of the migration file

### 2. Verify Backend
- [ ] Backend server reloaded automatically (check terminal)
- [ ] Visit http://localhost:8000/api/docs
- [ ] Look for `/api/v1/notes/` endpoints in the API docs
- [ ] Should see 4 endpoints:
  - GET `/api/v1/notes/lead/{lead_id}`
  - POST `/api/v1/notes/`
  - PUT `/api/v1/notes/{note_id}`
  - DELETE `/api/v1/notes/{note_id}`

### 3. Verify Frontend
- [ ] Frontend dev server reloaded automatically
- [ ] No TypeScript or build errors in terminal
- [ ] Browser console shows no errors

### 4. Test the Feature
- [ ] Navigate to http://localhost:8080/leads
- [ ] Click on any lead to open detail panel
- [ ] Scroll down to "Notes" section
- [ ] Type a test note: "Testing notes feature"
- [ ] Click "Add Note" button
- [ ] ✅ Success toast appears: "Note Added"
- [ ] ✅ Note appears in the list below
- [ ] ✅ Textarea is cleared
- [ ] Close and reopen the lead panel
- [ ] ✅ Note persists and is still visible

### 5. Test Error Handling
- [ ] Try submitting an empty note
- [ ] ✅ "Add Note" button should be disabled
- [ ] Check browser console for errors
- [ ] ✅ No console errors should appear

## If Something Goes Wrong

### Error: "Failed to save note"
**Check:**
1. Are you logged in? (Check top-right corner)
2. Did the database migration run successfully?
3. Is the backend server running?
4. Check browser console for detailed error

### Error: 401 Unauthorized
**Fix:**
1. Log out and log back in
2. Check `.env` file has correct Supabase credentials
3. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Notes don't show up
**Check:**
1. Database migration completed successfully
2. RLS policies are created (run verification queries)
3. You're viewing the same lead you added the note to
4. Refresh the page

### Backend errors
**Check:**
1. Terminal running backend for error messages
2. Make sure `routers/notes.py` exists
3. Verify `main.py` includes notes router
4. Try restarting backend: Ctrl+C then `npm run dev`

## Success Criteria

🎉 Feature is working when:
- ✅ You can add notes to leads
- ✅ Notes appear immediately after adding
- ✅ Notes persist after closing and reopening lead
- ✅ Success/error messages show appropriately
- ✅ No console errors

## Files Created/Modified

### New Files:
- ✅ `backend/routers/notes.py`
- ✅ `src/services/notesApi.ts`
- ✅ `migrations/001_create_notes_table.sql`
- ✅ `NOTES_FEATURE_IMPLEMENTATION.md`
- ✅ `SETUP_CHECKLIST.md` (this file)

### Modified Files:
- ✅ `backend/main.py`
- ✅ `src/components/leads/LeadDetailPanel.tsx`
- ✅ `supabase-schema.sql`

## Next Steps After Setup

Once the basic feature is working, consider:
1. **Test with multiple leads** to ensure notes are lead-specific
2. **Test with team members** to verify multi-tenant security
3. **Add more notes** to test list display
4. **Review the documentation** in `NOTES_FEATURE_IMPLEMENTATION.md`
5. **Plan future enhancements** (edit notes, delete notes, rich text, etc.)

---

**Need Help?**
- Review `NOTES_FEATURE_IMPLEMENTATION.md` for detailed documentation
- Check backend terminal for error logs
- Check frontend browser console for errors
- Verify database migration ran successfully in Supabase
