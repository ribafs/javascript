// Base code from https://css-tricks.com/examples/DragAndDropFileUploading/?submit-on-demand

'use strict';

;( function( $, window, document, undefined )
{
  // feature detection for drag&drop upload

  var isAdvancedUpload = function()
  {
    var div = document.createElement( 'div' );
    return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
  }();


  // applying the effect for every form

  $( '.box' ).each( function()
  {
    var $form		 = $( this ),
        $input		 = $form.find( 'input[type="file"]' ),
        $label		 = $form.find( 'label' ),
        $errorMsg	 = $form.find( '.box__error span' ),
        $restart	 = $form.find( '.box__restart' ),
        droppedFiles = false,
        showFiles	 = function( files )
        {
          $label.text( files.length > 1 ? ( $input.attr( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name );
        };

    $input.on( 'change', function( e )
    {
      showFiles( e.target.files );


    });


    // drag&drop files if the feature is available
    if( isAdvancedUpload )
    {
      $form
          .addClass( 'has-advanced-upload' ) // letting the CSS part to know drag&drop is supported by the browser
          .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
          {
            // preventing the unwanted behaviours
            e.preventDefault();
            e.stopPropagation();
          })
          .on( 'dragover dragenter', function() //
          {
            $form.addClass( 'is-dragover' );
          })
          .on( 'dragleave dragend drop', function()
          {
            $form.removeClass( 'is-dragover' );
          })
          .on( 'drop', function( e )
          {
            droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
            showFiles( droppedFiles );
          });
    }

    // Firefox focus bug fix for file input
    $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
  });

})( jQuery, window, document );