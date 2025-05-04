import api from './axios';
import { supabase } from './SupabaseClient';

export const login = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        if (data.session) {
            localStorage.setItem('token', data.session.access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.session.access_token}`;
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    } catch (error) {
        throw error;
    }
}; 