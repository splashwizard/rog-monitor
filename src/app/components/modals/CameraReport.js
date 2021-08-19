import React, {Component, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Modal, Row, Button} from 'antd';
import ReactToPrint from 'react-to-print';
import { LineChartOutlined } from '@ant-design/icons';
import noImage from '../../../assets/img/no-image.jpg';

const CameraReportModal = ({
  onCancel,
  lineVisible,
  lineImg,
  lineChartLoadError,
  lineImgLoadError,
  pieVisible,
  pieImg,
  pieChartLoadError,
  pieImgLoadError
}) => {
  const componentRef = useRef();
  return (
    <Modal
      visible={lineVisible}
      style={styles.modal}
      onCancel={onCancel}
      footer={[null, null]}
      width="90vw"
      destroyOnClose
    >
      <Row>
        <ReactToPrint
          trigger={() => <Button type='primary' style={styles.printButton}>Print Report</Button>}
          content={() => componentRef.current}
        />
      </Row>
      <div ref={componentRef} style={styles.reportContainer}>
        <Row>
          {pieImgLoadError ?
            <img src={noImage} style={styles.expandedPie} />
          :
            <img src={pieImg} onError={pieChartLoadError} style={styles.expandedPie} />
          }
        </Row>
        <Row>
          {lineImgLoadError ?
            <img src={noImage} style={styles.expandedLine} />
          :
            <img src={lineImg} onError={lineChartLoadError} style={styles.expandedLine} />
          }
        </Row>
      </div>
    </Modal>
  );
};

class CameraReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineVisable: false,
      pieVisable: false,
      lineImgLoadError: false,
      pieImgLoadError: false
    }
  }

  showLineChart = () => {
    this.setState({lineVisible: true});
  };

  showPieChart = () => {
    this.setState({pieVisable: true});
  }

  handleCancel = () => {
    this.setState({lineVisible: false});
    this.setState({pieVisable: false});
  };

  handleLineChartLoadError = () => {
    this.setState({lineImgLoadError: true});
  }

  handlePieChartLoadError = () => {
    this.setState({pieImgLoadError: true});
  }

  render() {
    return (
      <div>
        <LineChartOutlined onClick={this.showLineChart} />
        <CameraReportModal
          onCancel={this.handleCancel}
          lineImg={`${process.env.REACT_APP_REPORT_IMG_URL}/${this.props.data.uuid}_daily_chart.png`}
          lineVisible={this.state.lineVisible}
          lineChartLoadError={this.handleLineChartLoadError}
          lineImgLoadError={this.state.lineImgLoadError}
          pieImg={`${process.env.REACT_APP_REPORT_IMG_URL}/${this.props.data.uuid}_daily_pie.png`}
          pieVisible={this.state.pieVisable}
          pieChartLoadError={this.handlePieChartLoadError}
          pieImgLoadError={this.state.pieImgLoadError}
        />
      </div>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center',
    wordBreak: 'break-word',
    top: '25px'
  },
  reportContainer: {
    marginTop: 10,
  },
  expandedPie: {
    maxWidth: '90vw',
    maxHeight: '45vh',
    margin: '0 auto'
  },
  expandedLine: {
    maxWidth: '90vw',
    maxHeight: '45vh',
    margin: '0 auto'
  },
  printButton: {
    marginTop: -10
  }
};

const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertTags: (user, reportUuid, tags, tag_options) => dispatch(updateAlertTags(user, reportUuid, tags, tag_options))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CameraReport));
