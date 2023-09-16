import React, { useLayoutEffect, useRef } from 'react'
import { BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import { Keyboard } from 'react-native'
import Exhibitors from './Exhibitors.js'

export default function Modal() {

    const bottomSheetModalRef = useRef(null)

    useLayoutEffect(() => {
      bottomSheetModalRef.current?.present()  
    }, [])
  
    const snapPoints = [
      '10.5%', '50%', '95%'
    ]
  
    const handleSheetChanges = (index) => {
      if (index != 2) {
          Keyboard.dismiss();
      }
    }

    return (
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            keyboardBehavior="extend"
            onChange={handleSheetChanges}
            adjustPan={true}
            handleIndicatorStyle={{backgroundColor: 'lightgray', width: 35, height: 4.5, borderRadius: 10}}
            backgroundStyle={{
              borderRadius: 10,
              shadowOpacity: 0.10,
            }}
          >
            <Exhibitors />
          </BottomSheetModal>
        </BottomSheetModalProvider>
    )
}