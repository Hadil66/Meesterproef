import { defineEventHandler, readBody, setResponseStatus, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const wpApiBaseUrl = config.public.wordpressApiUrl;
  const wpUsername = config.public.wpUsername;
  const wpAppPassword = config.wpAppPassword;
  const wpBookingApiPath = '/wp/v2/reserveringen';

  if (!wpApiBaseUrl || !wpUsername || !wpAppPassword) {
    console.error("[Server] CRITICAL: WordPress API configuration is missing."); 
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error.',
    });
    
  }

  const fullWordPressBookingEndpoint = `${wpApiBaseUrl}${wpBookingApiPath}`;

  try {
    const clientPayload = await readBody(event);
    console.log("[Server] Received booking payload. Room ID:", clientPayload?.acf?.booking_room_id, "Date:", clientPayload?.acf?.booking_date);

    // SERVER-SIDE VALIDATION
    if (!clientPayload?.acf?.booking_room_id || !clientPayload?.acf?.booking_date || !clientPayload?.acf?.booking_time_slots?.length) {
      console.error("[Server] Validation failed: Missing essential booking fields.");
      throw createError({
        statusCode: 400,
        statusMessage: 'Ongeldige boekingsgegevens. Vereiste velden ontbreken.',
      });
    }

    const wordpressPostBody = {
      title: clientPayload.title || `Reservering: ${clientPayload.acf.booking_room_id} op ${clientPayload.acf.booking_date}`,
      status: clientPayload.status || "publish",
      acf: clientPayload.acf,
    };


    const base64Credentials = btoa(`${wpUsername}:${wpAppPassword}`);

    const wpResponse = await $fetch(fullWordPressBookingEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
      body: wordpressPostBody,
    }).catch((wpError) => {
      console.error('[Server] WordPress API Error. Status:', wpError.response?.status, 'Data:', JSON.stringify(wpError.data, null, 2));
      const errorMessage = wpError.data?.message || wpError.message || 'Onbekende WordPress API fout';
      throw createError({
        statusCode: wpError.response?.status || 502,
        statusMessage: `Fout bij WordPress: ${errorMessage}`,

      });
    });

    if (wpResponse && (wpResponse as any).id) {
      setResponseStatus(event, 201);
      return {
        success: true,
        message: "Reservering succesvol aangemaakt!",
        bookingId: (wpResponse as any).id,
      };
    } else {
      console.error('[Server] Unexpected WordPress API Response structure:', wpResponse);
      throw createError({
        statusCode: 502,
        statusMessage: 'Onverwachte reactie van WordPress.',
      });
    }

  } catch (error: any) {
    console.error("[Server] Error in submitBooking route:", error.message, error.data || error.cause || '');
    setResponseStatus(event, error.statusCode || 500);
    return {
      success: false,
      message: error.statusMessage || "Serverfout bij verwerken boeking.",
    };
  }
});