const submitBooking = async () => {
    isSubmittingBooking.value = true;
    apiError.value = null;
  
    if (!selectedRoomObject.value) {
      return;
    }
  
    const bookingPayload = {
      status: "publish",
      title: `Reservering voor ${selectedRoomObject.value.name} op ${formatDateISO(selectedDate.value)}`,
      acf: {
        booking_room_id: selectedRoomObject.value.id,
        booking_date: formatDateISO(selectedDate.value),
        booking_time_slots: [...timeSelection.value],
        booking_comment: reservationComment.value || "",
      },
    };
  
    console.log("Submitting Booking Payload to Nuxt Server Route:", JSON.stringify(bookingPayload, null, 2));
  
    try {
      // Use $fetch to call your Nuxt server API route
      const response = await $fetch('/api/submitBooking', {
        method: 'POST',
        body: bookingPayload,
      });
  
      lastBookingDetails.value = {
        roomId: selectedRoomObject.value.id,
        roomName: selectedRoomObject.value.fullName,
        date: formatDateISO(selectedDate.value),
        formattedDate: formattedSelectedDateLong.value,
        times: [...timeSelection.value],
        comment: reservationComment.value || "",
        isApiBooking: true,
      };
      await fetchAllBookings(); // Refresh bookings
      currentStep.value = 4; // Move to confirmation
    } catch (error: any) {
      console.error("Error submitting booking via Nuxt server route:", error.data || error.message);
      apiError.value = `Fout bij het maken van de reservering: ${error.data?.message || error.data?.statusMessage || error.message}.`;
    } finally {
      isSubmittingBooking.value = false;
    }
  };