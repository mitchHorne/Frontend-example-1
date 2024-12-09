import styled from 'styled-components'
import PropTypes from 'prop-types'
import { always } from 'ramda'

const Wrapper = styled.div`
  background-color: white;
  border-radius: 0.2rem;
  border: 1px solid #ccc;
  display: flex;
  flex-flow: column nowrap;
  height: auto;
  left: ${({ left }) => left}px;
  position: absolute;
  top: ${({ top }) => top}px;
  width: 200px;
`

const MenuItem = styled.div`
  --box-shadow: inset 0.1rem 0 0.5rem gray;
  --default-background: white;
  --hover-background: rgba(15, 20, 25, 0.1);

  --disabled-background: lightgray;
  --disabled-color: rgba(0, 0, 0, 0.5);

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-size: 12px;
  font-weight: 600;
  padding: 0.5rem;

  background-color: ${({ disabled }) =>
    disabled ? 'var(--disabled-background)' : 'var(--default-background)'};

  ${({ disabled }) => (disabled ? 'box-shadow: var(--box-shadow)' : '')};
  ${({ disabled }) => (disabled ? 'color: var(--disabled-color)' : '')};

  :hover {
    background-color: ${({ disabled }) =>
      disabled ? 'var(--disabled-background)' : 'var(--hover-background)'};
  }

  :active {
    box-shadow: var(--box-shadow);
  }
`

export const ContextMenu = ({
  left,
  top,
  onEdit,
  onDelete,
  onDuplicate,
  canEdit
}) => (
  <Wrapper left={left} top={top} canEdit={canEdit}>
    <MenuItem onClick={canEdit ? onDelete : always(null)} disabled={!canEdit}>
      Delete
    </MenuItem>

    <MenuItem onClick={canEdit ? onEdit : always(null)} disabled={!canEdit}>
      Edit Name / Description / User
    </MenuItem>

    <MenuItem onClick={onDuplicate}>Duplicate Thread</MenuItem>
  </Wrapper>
)

ContextMenu.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  left: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired
}
