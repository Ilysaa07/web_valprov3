import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Token tidak ditemukan' },
                { status: 400 }
            );
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY not configured');
            return NextResponse.json(
                { success: true, score: 1.0, message: 'reCAPTCHA not configured, bypassing' },
                { status: 200 }
            );
        }

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({
                success: true,
                score: data.score,
                action: data.action,
            });
        } else {
            return NextResponse.json({
                success: false,
                score: 0,
                errors: data['error-codes'],
            });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Verification failed' },
            { status: 500 }
        );
    }
}
