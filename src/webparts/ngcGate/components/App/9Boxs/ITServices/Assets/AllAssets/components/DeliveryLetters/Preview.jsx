import { FileTextOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Table, Typography } from "antd";
import axios from "axios";
import moment from "moment-hijri";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import logo from "../../../../../../../../assets/images/logo.png";
import { AppCtx, apiUrl } from "../../../../../../App";

const Preview = ({ id, btnLabel }) => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState({});
  const { defualt_route } = useContext(AppCtx);

  const FetchData = async (id) => {
    axios({
      method: "GET",
      url: `${apiUrl}/Asset/GetDeliveryNoteById/${id}`,
    }).then((response) => {
      if (response.data.Message == "success" || response.data.Status == 200) {
        setData(response.data.Data);
      }
    });
  };

  useEffect(() => {
    if (id && openModal) {
      FetchData(id);
    }
  }, [openModal]);

  const headerStyle = {
    padding: "7px 0px",
    backgroundColor: "var(--third-color)",
    textAlign: "center",
    marginBottom: "12px!important",
  };

  return (
    <>
      <Typography.Link onClick={() => setOpenModal(true)}>
        {btnLabel || "Preview"}
      </Typography.Link>
      <Modal
        title={
          <>
            <FileTextOutlined /> Delivery Letter #{id}
          </>
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className="more-width-antd-modal"
        okButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        // footer={[
        //   {/* <Button type='primary' onClick>
        //     Return
        //   </Button> */},
        //   <Button onClick={() => setOpenModal(false)}>
        //     Cancel
        //   </Button>,
        // ]}
      >
        <Row gutter={[15, 15]}>
          {data.Status === "Acknowledged_By_User" && (
            <img
              style={{
                position: "absolute",
                opacity: "0.15",
                maxWidth: "80%",
                top: "120px",
                left: "0",
              }}
              src="https://previews.123rf.com/images/imagecatalogue/imagecatalogue1701/imagecatalogue170105331/70329743-complete-text-rubber-seal-stamp-watermark-tag-inside-rectangular-shape-with-grunge-design-and-scratc.jpg?fj=1"
            />
          )}

          <Col span={24}>
            <img
              src={logo}
              alt=""
              width="300px"
              style={{ marginLeft: "calc(50% - 150px)" }}
            />
          </Col>

          <Col span={24}>
            <Typography.Title style={headerStyle} level={3}>
              IT Delivery Letter
            </Typography.Title>
            <Row gutter={[10, 10]}>
              <Col md={24} lg={12}>
                <Typography.Title level={5}>Date And Time</Typography.Title>
                <Typography.Text>
                  {moment(data.CreatedAt).format("MM/DD/YYYY hh:mm")}
                </Typography.Text>
              </Col>
              <Col md={24} lg={12}>
                <Typography.Title level={5}>Delivered By</Typography.Title>
                <Typography.Text>
                  {data.UpdatedByUser?.DisplayName}
                </Typography.Text>
              </Col>
              <Col md={24} lg={12}>
                <Typography.Title level={5}>Delivered To</Typography.Title>
                <Typography.Text>{data.ToUser?.DisplayName}</Typography.Text>
              </Col>
              <Col md={24} lg={12}>
                <Typography.Title level={5}>Status</Typography.Title>
                <Typography.Text type="success">
                  {data.Status === "Submitted_By_IT" ? (
                    <Typography.Text type="warning" strong>
                      Pending
                    </Typography.Text>
                  ) : (
                    <Typography.Text type="success" strong>
                      Acknowledged{" "}
                      {moment(data.UpdatedAt).format("MM/DD/YYYY hh:mm")}
                    </Typography.Text>
                  )}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Table
                  columns={[
                    {
                      title: "#",
                      dataIndex: "",
                      render: (_, record) => (
                        <span>{`${data.Assets?.indexOf(record) + 1}`}</span>
                      ),
                      width: "5%",
                    },
                    {
                      title: "Item/ Tag Number/ SN/ Asset Number",
                      dataIndex: "Asset",
                      render: (val) => (
                        <Typography.Link
                          href={`${defualt_route}/asset/manage/${val?.Id}`}
                          target="_blank"
                        >
                          {val?.Name}
                        </Typography.Link>
                      ),
                      width: "80%",
                    },
                    {
                      title: "Details",
                      dataIndex: "",
                      render: () =>
                        moment(data.CreatedAt).format("MM/DD/YYYY hh:mm"),
                      width: "15%",
                    },
                  ]}
                  dataSource={data.Assets}
                  pagination={false}
                />
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Typography.Title style={headerStyle} level={3}>
              Supplied Accessories
            </Typography.Title>
            <ul>
              {data.NonAssets?.map((row) => (
                <li>
                  <Typography.Text strong> - {row?.Name}</Typography.Text>
                </li>
              ))}
            </ul>
          </Col>

          <Col span={24}>
            <Typography.Title style={headerStyle} level={3} >
              Requestor Commitment & Acknowledgment
            </Typography.Title>
            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      verticalAlign: "top",
                      width: "50%",
                      textAlign: "justify",
                      paddingRight: "15px",
                      fontSize: "10.5px",
                    }}
                  >
                    <h4 style={{ fontSize: "14px", lineHeight: 1.4 }}>
                      By clicking on "Acknowledge", I accepts and fully
                      commitment of the following:
                    </h4>
                    <ul style={{ marginTop: "8px !important" }}>
                      <li style={{ textAlign: "justify", fontSize: "10.5px" }}>
                        I have received the devices as configured above. I
                        understand that I am directly responsible for
                        maintaining the computer in an appropriate environment
                        to prevent damage and/or theft of the computer or its
                        related components. In case of damage, theft or loss due
                        to negligence , I will be fully charged the repair or
                        replacement cost of the damaged equipments. I also
                        understand that computer is for SALIC Business use and
                        will not be used for any illegal activities, Criminal,
                        Threats, Harassment, Copyright infringement, Defamation,
                        and unauthorized access. I also agree to return the
                        devices to IT Department in case of assignment finished,
                        transferred, resigned, retired or my contract
                        terminated.
                      </li>
                      <li style={{ fontSize: "10.5px" }}>
                        <b>
                          Accept and Adherence to all procedures followed by
                          SALIC regarding cyber security rules and policies.
                        </b>
                      </li>
                    </ul>
                  </td>
                  <td
                    style={{
                      direction: "rtl",
                      verticalAlign: "top",
                      width: "50%",
                      textAlign: "justify",
                      paddingLeft: "15px",
                      fontSize: "13px",
                    }}
                  >
                    <h4 style={{ fontSize: "18px", lineHeight: 1.4 }}>
                      بالنقر على زر "إقرار"، اقر بالالتزام الكامل بما يلي:
                      <br />
                    </h4>
                    <ul style={{ marginTop: "8px !important" }}>
                      <li style={{ fontSize: "13px" }}>
                        استلمت الأجهزة المذكوره أعلاه، واتعهد بالمحافظة عليها
                        واستخدامها بشكل صحيح بالمهام الخاصة لشركه "سالك" وعدم
                        استخدامها في أي انشطة خارجية أو شخصية أو غير قانونية
                        وكذلك عدم استخدامها لانشطه اجرامية تتمثل في تنفيذ هجمات
                        أمنية على شبكات أو أجهزة اخرى داخلية أو خارجية. وأتعهد
                        بتحمل كامل التبعيات القانونيه في حالة حدوث تلف أو سرقه
                        أو ضياع بسبب الأهمال أو سوء الاستخدام. وأتعهد أيضاً
                        بإعادة هذه الأجهزة إلى قسم تقنية المعلومات في حالة
                        انتهاء فترة التعاقد أو الاستقالة أو التقاعد.
                      </li>
                      <li style={{ fontSize: "12px" }}>
                        <b>
                          الإلتزام الكامل والتقيد بكل الإجراءات والقيود المتبعة
                          في "سالك" فيما يتعلق بالأمن السيبراني.
                        </b>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Preview;
