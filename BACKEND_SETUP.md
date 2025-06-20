# Backend Setup Guide

## 🎯 **Complete Supabase Integration for Grad School Compass**

### **1. Database Setup**

#### Run SQL in Supabase Dashboard:
1. Go to your Supabase project → **SQL Editor**
2. Copy the SQL from `supabase/migrations/create_grad_school_tables.sql`
3. Execute to create all tables and security policies

#### Tables Created:
- `universities` - University applications
- `requirements` - Admission requirements per university
- `deadlines` - Application deadlines
- `documents` - Application documents
- `post_grad_info` - Career and visa information
- `user_scores` - User's test scores and GPA

### **2. Environment Variables**
Ensure your `.env.local` has:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **3. Authentication Setup**
In Supabase Dashboard → **Authentication**:
- Enable email/password authentication
- Configure email templates (optional)
- Set up OAuth providers (optional)

### **4. Row Level Security (RLS)**
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Proper foreign key relationships
- Secure data isolation

### **5. Integration Steps**

#### A. Replace Mock Data Usage
Update these components to use real data:

1. **Universities Page** (`src/pages/Universities.tsx`):
```typescript
import { useUniversities } from '@/hooks/useUniversities';

// Replace: import { universities } from '@/data/mockData';
// With: const { data: universities = [] } = useUniversities();
```

2. **Dashboard** (`src/pages/Dashboard.tsx`):
```typescript
import { useUniversities } from '@/hooks/useUniversities';
import { useDeadlines } from '@/hooks/useDeadlines';

// Replace mock data imports with hooks
```

3. **All Components** using mock data should be updated similarly

#### B. Add CRUD Operations
The hooks provide:
- `useUniversities()` - Fetch all universities
- `useCreateUniversity()` - Add new university
- `useUpdateUniversity()` - Update university
- `useDeleteUniversity()` - Delete university
- Similar hooks for deadlines, documents, etc.

### **6. Testing the Backend**

#### Test Authentication:
1. Register a new user
2. Login/logout functionality
3. Protected routes work correctly

#### Test Data Operations:
1. Add a university
2. Create deadlines
3. Upload documents
4. Track requirements

### **7. Data Migration from Mock**
If you want to keep current mock data as defaults:

```sql
-- Insert sample universities for new users
INSERT INTO universities (user_id, name, program_name, location, deadline, status, tag, application_fee, url)
SELECT 
  auth.uid(),
  'Stanford University',
  'MS in Computer Science',
  'Stanford, CA',
  '2024-12-15',
  'researching',
  'reach',
  125,
  'https://cs.stanford.edu'
WHERE NOT EXISTS (
  SELECT 1 FROM universities WHERE user_id = auth.uid()
);
```

### **8. Production Considerations**

#### A. Database Optimization:
- Add indexes for frequently queried columns
- Set up database backups
- Monitor performance

#### B. Security:
- Review RLS policies
- Set up proper CORS settings
- Enable database logging

#### C. File Storage (for documents):
- Enable Supabase Storage
- Set up file upload policies
- Configure file size limits

### **9. Next Steps**

1. **Run the SQL migration** in Supabase
2. **Update components** to use hooks instead of mock data
3. **Test authentication** flow
4. **Add error handling** for network requests
5. **Implement loading states** for better UX
6. **Set up file uploads** for documents
7. **Add real-time subscriptions** for live updates

### **10. File Upload Setup (Optional)**
```typescript
// Example for document upload
const uploadDocument = async (file: File, universityId: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(`${universityId}/${file.name}`, file);
  
  if (error) throw error;
  return data;
};
```

### **11. Real-time Updates (Optional)**
```typescript
// Subscribe to university changes
useEffect(() => {
  const subscription = supabase
    .channel('universities_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'universities'
    }, (payload) => {
      queryClient.invalidateQueries(['universities']);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

This setup provides a complete, production-ready backend with authentication, data persistence, and real-time capabilities!