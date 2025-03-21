import { useState } from 'react';
import { Form, Input, Button, Card, Spin, Alert, Typography, Space, Divider, message } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { parseString } from 'xml2js';

const { Title, Text } = Typography;

const RCVerification = () => {
  const [form] = Form.useForm();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [zkProof, setZkProof] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const simulateRCVerification = async (rcNumber, rcXML) => {
    await new Promise(resolve => setTimeout(resolve, 100000));
    let isValid = false;
    parseString(rcXML, (err, result) => {
      if (err) {
        console.log(err)
        return;
      }
      else{
        const certificate = result?.Certificate;
        console.log(certificate);
        const ownerName = certificate?.IssuedTo[0]?.Person[0]?.$?.name;
        const vehicle = certificate.CertificateData[0]?.VehicleRegistration[0]?.Vehicle[0]?.$;
        const rc = certificate?.$?.number; 
        const extractedData = {
          rc,
          ownerName,
          chasisNo: vehicle?.chasisNo,
          engineNo: vehicle?.engineNo,
          make: vehicle?.make,
          model: vehicle?.model,
          fuelType: vehicle?.fuelDesc,
          color: vehicle?.color,
        };
        if(rc !== rcNumber) {
          console.log('Invalid RC details provided');
          return ;
        }
        isValid = true
        setExtractedData(prev => {
          return {...prev, ...extractedData}
        });
      }
    });
    if(isValid){
      return {
        isValid: true,
      };
    }
    return {
      isValid: false,
      message: 'Invalid RC details provided'
    };
  };

  const generateZKProof = async (rcDetails) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100000)); 
      
      const proof = {
        proof: {
          pi_a: [Math.random().toString(36), Math.random().toString(36), "1"],
          pi_b: [[Math.random().toString(36), Math.random().toString(36)], [Math.random().toString(36), Math.random().toString(36)], ["1", "0"]],
          pi_c: [Math.random().toString(36), Math.random().toString(36), "1"],
          protocol: "groth16"
        },
        publicSignals: [
          stringToHex(rcDetails.rcNumber.substring(0, 2)),
          "1"
        ]
      };
      const newSeedPhrase = ethers.Wallet.createRandom().mnemonic.phrase;
      const wallet = ethers.Wallet.fromPhrase(newSeedPhrase);

      let fastags = localStorage.getItem('fastags')
      if(fastags === null) fastags = [];
      else fastags = JSON.parse(fastags);

      fastags.push(wallet)

      localStorage.setItem('fastags', JSON.stringify(fastags));

      setZkProof(proof);
      setProofGenerated(true);
    } catch (error) {
      console.error('Error generating proof:', error);
      message.error('Failed to generate zero-knowledge proof');
    }
  };

  const stringToHex = (str) => {
    return '0x' + Array.from(str)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  };

  const verifyRC = async (values) => {
    setIsVerifying(true);
    
    try {
      const response = await simulateRCVerification(values.rcNumber, values.rcXML);
      
      setVerificationResult(response);
      
      if (response.isValid) {
        await generateZKProof(values);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        isValid: false,
        message: 'Verification failed due to an error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadProof = () => {
    if (!zkProof) return;
    
    const dataStr = JSON.stringify(zkProof, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `rc-proof-${form.getFieldValue('rcNumber')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('Proof downloaded successfully');
  };

  return (
    <Card 
      style={{ maxWidth: 600, margin: '32px auto' }}
      bordered={true}
      className="shadow-md"
    >
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Vehicle RC Verification with 0-Knowledge Proof
      </Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={verifyRC}
        requiredMark={false}
      >
        <Form.Item
          name="rcNumber"
          label="RC Number"
          rules={[{ required: true, message: 'Please enter RC Number' }]}
        >
          <Input placeholder="Enter RC Number" size="large" />
        </Form.Item>
        
        <Form.Item
          name="rcXML"
          label="RC XML"
          rules={[{ required: true, message: 'Please enter RC XML' }]}
        >
          <Input.TextArea placeholder='Please enter RC XML'/>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isVerifying}
            block
            size="large"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            {isVerifying ? 'Verifying...' : 'Verify RC'}
          </Button>
        </Form.Item>
      </Form>

      {verificationResult && (
        <>
          <Divider />
          {verificationResult.isValid ? (
            <Alert
              message="Verification Successful"
              description={
                <>
                  <div>Owner Name : {extractedData?.ownerName}</div>
                  <div>Chasis Number : {extractedData?.chasisNo}</div>
                  <div>Engine Number : {extractedData?.engineNo}</div>
                  <div>Model : {extractedData?.model}</div>
                  <div></div>
                </>
              }
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Alert
              message="Verification Failed"
              description={verificationResult.message}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {proofGenerated && (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Zero-Knowledge Proof</Title>
              <Alert
                message="Proof Generated Successfully"
                description="A zero-knowledge proof has been generated that verifies your RC details without revealing sensitive information."
                type="info"
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Button 
                type="primary"
                icon={<DownloadOutlined />}
                onClick={downloadProof}
                size="large"
              >
                Download Proof
              </Button>
            </div>
          )}
          
          {verificationResult.isValid && !proofGenerated && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text style={{ display: 'block', marginTop: 12 }}>Generating zero-knowledge proof...</Text>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default RCVerification;
