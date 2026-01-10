import styled from "styled-components";

export default function DevWarn() {
    return (
        <Container>
            <h3>Em desenvolvimento</h3>
        </Container>
    )
}

const Container = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1677ff;
    color: white;
    height: 30px;
    margin-top: 0px;
    cursor: pointer;

    h3 {
        text-align: center;
        font-size: 1rem;
    }
`;