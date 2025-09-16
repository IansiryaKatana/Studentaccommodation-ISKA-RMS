-- Update admin user to super_admin role
UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'admin@iska-rms.com';

-- Verify the update
SELECT 'Admin user role updated successfully!' as status;
