import styled from 'styled-components'

const Background = styled.div`
  background-image: url('https://res.cloudinary.com/dzres3un2/image/upload/v1680238758/pexels-clarissa-schwarz-8941370_bf2qr0.jpg');
  background-size: cover;
  min-height: 100vh;
`

const CardWrapper = styled.div`
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-left: 1rem;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`

const ImageWrapper = styled.div`
  height: 200px;
  position: relative;
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const WhiteSpace = styled.div`
  height: 50px;
  width: 100%;
  position: relative;
`

const CardTitle = styled.h2`
  margin: 0 0 16px;
  color: #000000;
`

const CardDescription = styled.p`
  margin: 0 0 16px;
  color: #000000;
`

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  background-color: #fff;
`

const ReadMoreButton = styled.a`
  display: inline-block;
  padding: 8px 16px;
  background-color: #fff;
  color: #000000;
  font-size: 16px;
  font-weight: bold;
  border: none;
  text-decoration: none;

  &:hover {
    background-color: #f5f5f5;
  }
`

const TitleWrapper = styled.div`
  padding: 1rem;
  color: #000000;
`

const Resources = () => {
  return (
    <Background>
      <TitleWrapper>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Check out our resources page for more information.
        </CardDescription>
      </TitleWrapper>
      <CardWrapper>
        <ImageWrapper>
          <CardImage
            src='https://cdn.sanity.io/images/g5gr5att/production/281c58c10407f56c27c219f5c28947e08e65d930-1280x720.jpg?auto=format&w=400'
            alt='Resources'
          />
        </ImageWrapper>
        <WhiteSpace>
          <ButtonWrapper>
            <ReadMoreButton
              href='https://cdn.sanity.io/files/g5gr5att/production/3b27798422477768270b2b06f23be041e8c2e86a.pdf'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read More
            </ReadMoreButton>
          </ButtonWrapper>
        </WhiteSpace>
      </CardWrapper>
    </Background>
  )
}

export default Resources
