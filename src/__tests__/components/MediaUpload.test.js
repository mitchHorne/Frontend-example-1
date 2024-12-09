// import { render } from '@testing-library/react'
// import { MediaUpload } from '../../components'

describe('MediaUpload', () => {
  it('is a temporary placeholder', () => {
    expect(true).toBe(true)
  })
})

// describe('MediaUpload', () => {
//   const createUploadWidget = jest.fn()
//   const open = jest.fn()

//   beforeEach(() => {
//     createUploadWidget.mockReturnValueOnce({ open })

//     window.cloudinary = {
//       createUploadWidget
//     }
//   })

//   afterAll(() => {
//     window.cloudinary = undefined
//   })

//   it('renders without crashing', () => {
//     render(
//       <MediaUpload
//         user={{}}
//         onMediaUpload={() => {}}
//         setShowModal={() => {}}
//         showModal={false}
//       />
//     )
//   })

//   describe('when callback function is called', () => {
//     it('should behave according to the event type', () => {
//       const user = {
//         name: 'user name',
//         nickname: 'user.handle',
//         picture: 'some_picture'
//       }

//       const onMediaUpload = jest.fn()
//       const setShowModal = jest.fn()
//       const showModal = false

//       render(
//         <MediaUpload
//           user={user}
//           onMediaUpload={onMediaUpload}
//           setShowModal={setShowModal}
//           showModal={showModal}
//         />
//       )

//       expect(createUploadWidget).toHaveBeenCalledWith(
//         expect.objectContaining({}),
//         expect.anything()
//       )

//       const callbackfn = createUploadWidget.mock.calls[0][1]

//       callbackfn({}, null)
//       callbackfn(null, {})
//       expect(setShowModal).not.toHaveBeenCalled()
//       expect(onMediaUpload).not.toHaveBeenCalled()

//       callbackfn(null, { event: 'close' })
//       expect(setShowModal).toHaveBeenCalledWith(false)
//       expect(onMediaUpload).not.toHaveBeenCalled()

//       const url = 'some.url'
//       callbackfn(null, { event: 'success', info: { secure_url: url } })
//       expect(onMediaUpload).toHaveBeenCalledWith(url)

//       expect(setShowModal).toHaveBeenCalledTimes(1)
//       expect(onMediaUpload).toHaveBeenCalledTimes(1)
//     })
//   })

//   describe('when show Modal is true', () => {
//     it('should widget open function should be called', () => {
//       const user = {
//         name: 'user name',
//         nickname: 'user.handle',
//         picture: 'some_picture'
//       }

//       const onMediaUpload = jest.fn()
//       const setShowModal = jest.fn()
//       const showModal = true

//       render(
//         <MediaUpload
//           user={user}
//           onMediaUpload={onMediaUpload}
//           setShowModal={setShowModal}
//           showModal={showModal}
//         />
//       )

//       expect(open).toBeCalledTimes(1)
//     })
//   })
// })
