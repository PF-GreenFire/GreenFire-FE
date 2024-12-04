import {useNavigate} from "react-router-dom";
import {LuEraser} from "react-icons/lu";
import {FaTrashAlt} from "react-icons/fa";
import {Checkbox, Divider, Switch, Tag} from "antd";
// text editor
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Card from "react-bootstrap/Card";
import { Button, Container, Dropdown, Modal, Tab, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

function ExDesign() {

    // for tab
    const [key, setKey] = useState('home');

    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // for custom modal
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    // for return btn
    const navigate = useNavigate();
    const onClickHandler = () => navigate(-1);

    // for check box
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const onChangeCheck = (list) => {
        setCheckedList(list);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
    };

    const onChangeToggle = (checked) => {
        console.log(`switch to ${checked}`);
    };

    // for text editor
    const [value, setValue] = useState('');

    useEffect(() => {
        // 에디터 초기화
        setValue(''); // 초기값 설정
    }, []);

    return (
        <>
            <Container className="mt-5 justify-content-md-center">

                <h1 className="pt-5 border-2 border-bottom">tab left</h1>
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="home" title="상품정보">
                        내용 1
                    </Tab>
                    <Tab eventKey="profile" title="상세정보">
                        내용 2
                    </Tab>
                    <Tab eventKey="contact" title="상품후기">
                        내용 3
                    </Tab>
                </Tabs>

                <br/>

                <h1 className="pt-5 border-2 border-bottom">tab right</h1>
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 justify-content-end"
                >
                    <Tab eventKey="home" title="상품정보">
                        내용 1
                    </Tab>
                    <Tab eventKey="profile" title="상세정보">
                        내용 2
                    </Tab>
                    <Tab eventKey="contact" title="상품후기">
                        내용 3
                    </Tab>
                </Tabs>

                <br/>

                <h1 className="pt-5 border-2 border-bottom">Modal</h1>
                <h4>모달 1 : 닫기 버튼 X버튼 중복</h4>
                <h4>모달 2 : 중앙 배치</h4>
                <Button variant="success" onClick={handleShow}>
                    모달버튼
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>수정하시겠습니까?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>카테고리 이름을 어쩌구로 바꾸시겠습니까?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="success" className="text-white" onClick={handleClose}>
                            확인
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            취소
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="primary" onClick={handleShow}>
                    모달 열기
                </Button>


                <Modal show={show2} onHide={handleClose2} centered dialogClassName="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>수정하시겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>카테고리 이름을 어쩌구로 바꾸시겠습니까?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" className="text-white" onClick={handleClose2}>
                            확인
                        </Button>
                        <Button variant="secondary" onClick={handleClose2}>
                            취소
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h1 className="pt-5 border-2 border-bottom">이전 페이지로 이동 버튼</h1>
                <span onClick={onClickHandler} style={{cursor: 'pointer'}}>
                    〈 이전으로</span>{' '}

                <h1 className="pt-5 border-2 border-bottom">기본 버튼</h1>
                <Button variant="success">작성하기</Button>
                <Button variant="outline-secondary">취소</Button>
                <br/><br/>
                <Button variant="success" style={{cursor: 'pointer'}} className="w-25">기다란버튼</Button>

                <h1 className="pt-5 border-2 border-bottom">수정/삭제 버튼</h1>
                <button style={{background: "none", border: "none"}}>
                    <LuEraser/>
                </button>
                <button style={{background: "none", border: "none"}}>
                    <FaTrashAlt/>
                </button>

                <h1 className="pt-5 border-2 border-bottom">옵션 선택 버튼</h1>
                <Dropdown>
                    <Dropdown.Toggle className="custom-dropdown-toggle" variant="info">
                        정렬
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="1">추천순</Dropdown.Item>
                        <Dropdown.Item eventKey="2">최신순</Dropdown.Item>
                        <Dropdown.Item eventKey="3">낮은가격순</Dropdown.Item>
                        <Dropdown.Item eventKey="4">높은가격순</Dropdown.Item>
                        <Dropdown.Item eventKey="5">판매량순</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <h1 className="pt-5 border-2 border-bottom">antd 옵션 선택 버튼<h3>npm install antd</h3></h1>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    Check all
                </Checkbox>
                <Divider/>
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChangeCheck}/>

                <br/><br/><br/><br/>

                <p>토글</p>
                <hr/>
                <Switch defaultChecked onChange={onChangeToggle}/>

                <h1 className="pt-5 border-2 border-bottom">텍스트 입력<h3>npm install react-quill</h3></h1>
                <div style={{minWidth: "300px", minHeight: "250px"}}>
                    <ReactQuill
                        theme="snow" // 테마 설정
                        value={value} // 텍스트 에디터의 값
                        onChange={setValue} // 값이 변경될 때 호출되는 콜백 함수
                    />
                </div>

                <h1 className="pt-5 border-2 border-bottom">카드<h3>부트스트랩이고 우측하단 태그는 npm install antd / 다른 색상도 많아요!
                    https://ant.design/components/tag</h3></h1>
                <Card style={{width: '18rem', cursor: 'pointer'}}>
                    <Card.Img variant="top" src="/p1.png"/>
                    <Card.Body>
                        <Card.Title>제목
                        </Card.Title>
                        <Card.Text className="mb-0">
                            상품 간단 소개
                        </Card.Text>
                        <Card.Text className="fs-6 fw-lighter" style={{letterSpacing: '0.1em'}}>
                            24.05.01 - 25.12.31
                        </Card.Text>
                        <Tag
                            color="green"
                            style={{
                                fontSize: '16px', // 폰트 크기 조정
                                padding: '5px 10px', // 패딩 조정
                                float: 'right' // 우측 정렬
                            }}
                        >모집 중</Tag>
                    </Card.Body>
                </Card>

            </Container>
        </>
);
}

export default ExDesign;