import { useState, useEffect} from "react";
import './App.css';
import {deleteStudent, getAllStudents} from "./client";
import {Layout, Menu, Breadcrumb, Table, Spin, Empty, Button, Badge, Tag, Popconfirm, Radio, Image} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusCircleOutlined, PlusOutlined,
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";
import Avatar from "antd/es/avatar/avatar";
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
// const TheAvatar = ({firstName}, {lastName}) => {
//     let trim = firstName.trim();
//     let trim2 = lastName.trim();
//     if(trim.length === 0 && trim2.length === 0)  return <Avatar icon ={<UserOutlined/>}/>
//     //const split = trim.split(" ");
//     //if(split.length === 1) return <Avatar>{firstName.charAt(0)}</Avatar>
//     return <Avatar>{`${firstName.charAt(0)}${lastName.charAt(lastName.length - 1)}`}</Avatar>
// }

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchStudents => [
    // {
    //     title: '',
    //     dataIndex: 'avatar',
    //     key: 'avatar',
    //     render: (text, student) =>
    //         <TheAvatar firstName={student.firstName} lastName = {student.lastName}/>
    // },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.firstName}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "There Was An Issue",
                        `${res.message} [${res.status}] [${res.error}]`
                        )
                });
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log('Component Is Mounted')
        fetchStudents()
    }, []);

    const renderStudents = () => {
        if(fetching) return <Spin indicator={antIcon} />;
        if(students.length <= 0) {return <>   <Button
            onClick={() => setShowDrawer(!showDrawer)}
            type="primary" shape="round" icon={<PlusCircleOutlined />} size="small">
            Add Student
        </Button>
        <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            fetchStudents={fetchStudents}
        /> <Empty/> </>}

         return <>
             <StudentDrawerForm
                 showDrawer={showDrawer}
                 setShowDrawer={setShowDrawer}
                 fetchStudents = {fetchStudents}
             />
             <Table dataSource={students}
                       columns={columns(fetchStudents)}
                       bordered
                       title = {() => <>
                           <Tag  type = "primary" shape = "round" style ={{ backgroundColor: '#52c41a', color:'white'}}>Number Of Students:</Tag>
                       <Badge
                         className="site-badge-count-109"
                         count={students.length > 0 ? students.length : 0}
                         style={{ marginLeft: '2px', backgroundColor: '#52c41a' }}
                        />
                           <br/><br/>
                           <Button
                               onClick = {() => setShowDrawer(!showDrawer)}
                               type="primary" shape="round" icon={<PlusCircleOutlined />} size="small">
                               Add Student
                           </Button>
                       </>}
                       pagination={{ pageSize: 50 }}
                       scroll={{ y: 240 }}
                       rowKey = {student => student.id}
                       />;
             </>
    }

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <Image width={75}
                src={'https://t3.ftcdn.net/jpg/02/79/04/62/360_F_279046245_e98vNHYnuPc43frv3emx3yn0MmPpJvdo.jpg'}/>
            </Footer>
        </Layout>
    </Layout>
}

export default App;
