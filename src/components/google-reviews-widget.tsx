"use client";

import Script from "next/script";

/**
 * Embeds the SociableKit live Google Reviews widget.
 * Must be a Client Component because the third-party script manipulates the DOM.
 */
export function GoogleReviewsWidget() {
  return (
    <>
      <div className="sk-ww-google-reviews" data-embed-id="25680278" />
      <Script
        src="https://widgets.sociablekit.com/google-reviews/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
