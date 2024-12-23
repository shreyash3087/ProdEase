import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function GET(req) {
  const tokenObject = req.cookies.get('token');
  const token = tokenObject ? tokenObject.value : null;
  if (!token) {
    console.log('No token found.');
    return NextResponse.json({ user: null }, { status: 401 });
  }
  let decoded;
  try {
    decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed.');
      return NextResponse.json({ user: null }, { status: 401 });
    }
    if (decoded.role === 'Admin') {
      console.log('Admin access granted.');
    } else if (decoded.role === 'Team Member') {
      console.log('Member access granted.');
    } else {
      console.log('Access denied. Unknown role.');
      return NextResponse.json({ message: 'Access denied. Unknown role.' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error during token verification:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: decoded });
}
